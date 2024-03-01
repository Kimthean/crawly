import { Injectable } from '@nestjs/common';
import { Crawl, CrawlDto } from './dto/create-crawl.dto';
import * as puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CrawlService {
  async scrape(crawlDto: CrawlDto) {
    const { url } = crawlDto;
    try {
      const browser = await puppeteer.launch();
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

  async crawl(crawlDto: Crawl) {
    const urls = crawlDto.url;
    const responses = await Promise.all(
      urls.map((url) => this.scrape({ url })),
    );

    const jsonl = responses
      .map((response) => JSON.stringify(response))
      .join('\n');

    const filename = `${uuidv4()}_${new Date().toISOString().split('T')[0]}.jsonl`;

    const filePath = path.join(process.cwd(), 'data', filename);
    fs.writeFileSync(filePath, jsonl + '\n');

    return `JSONL file has been saved with filename: ${filename}`;
  }

  async CrawlLinks(crawlDto: CrawlDto) {
    try {
      const { url } = crawlDto;

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      let links = [];
      while (links.length < 40) {
        const newLinks = await page.evaluate(() => {
          const elements = Array.from(
            document.querySelectorAll('.section-more a'),
          );
          return elements.map((element) => element.getAttribute('href'));
        });

        links = Array.from(new Set(links.concat(newLinks)));

        if (links.length < 8) {
          await page.waitForSelector('.load-more .btn-load');

          await Promise.all([
            page.click('.load-more .btn-load'),
            page.waitForNavigation({
              waitUntil: 'networkidle2',
              timeout: null,
            }),
          ]);
        }
      }

      await browser.close();
      return links.slice(0, 8);
    } catch (error) {
      console.log(error);
    }
  }
}
