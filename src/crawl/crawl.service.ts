import { Injectable } from '@nestjs/common';
import { CrawlDto } from './dto/create-crawl.dto';
import * as puppeter from 'puppeteer';

@Injectable()
export class CrawlService {
  async crawl(crawlDto: CrawlDto) {
    const { url } = crawlDto;
    try {
      const browser = await puppeter.launch();
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const title = await page.evaluate(() => {
        const title = document.querySelector('title').innerText;
        return title;
      });
      const authorName = await page.$eval('.authname', (el) => el.textContent);
      const publishDate = await page.$eval(
        '.paraclass',
        (el) => el.textContent,
      );
      const category = await page.$eval(
        '.ads-social-left-title h2',
        (el) => el.textContent,
      );
      const content = await page.evaluate(() => {
        const elements = Array.from(
          document.querySelectorAll('.article-text p, .article-text img'),
        );
        const result = [];

        elements.forEach((element) => {
          if (element.tagName === 'P') {
            const textContent = element.textContent.trim();
            if (textContent !== '') {
              result.push({ type: 'text', content: textContent });
            }
          } else if (element.tagName === 'IMG') {
            const src = element.getAttribute('src');
            result.push({ type: 'image', src });
          }
        });

        return result;
      });

      const response = {
        title,
        url,
        authorName,
        category,
        publishDate,
        content,
      };

      await browser.close();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
