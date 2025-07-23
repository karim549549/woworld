import { Injectable } from '@nestjs/common';
import mjml2html from 'mjml';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailFactory {
  private templateCache: Map<string, Handlebars.TemplateDelegate> = new Map();

  constructor() {}

  private async getTemplate(
    templateName: string,
  ): Promise<Handlebars.TemplateDelegate> {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(
        templateName,
      ) as Handlebars.TemplateDelegate;
    }

    // Path to the compiled MJML templates in the dist folder
    const templatePath = path.join(
      process.cwd(),
      'dist', // Assuming assets are copied to dist
      'email',
      'templates',
      `${templateName}.mjml`,
    );

    // Fallback for development if not running from dist (e.g., during `nest start --watch`)
    const devTemplatePath = path.join(
      process.cwd(),
      'src',
      'email',
      'templates',
      `${templateName}.mjml`,
    );

    let mjmlContent: string;
    if (fs.existsSync(templatePath)) {
      mjmlContent = await fs.promises.readFile(templatePath, 'utf8');
    } else if (fs.existsSync(devTemplatePath)) {
      mjmlContent = await fs.promises.readFile(devTemplatePath, 'utf8');
    } else {
      throw new Error(
        `Email template ${templateName}.mjml not found at ${templatePath} or ${devTemplatePath}`,
      );
    }

    const compiledTemplate = Handlebars.compile(mjmlContent);
    this.templateCache.set(templateName, compiledTemplate);
    return compiledTemplate;
  }

  async renderTemplate(
    templateName: string,
    data: Record<string, any>,
  ): Promise<string> {
    const compiledHandlebarsTemplate = await this.getTemplate(templateName);
    const mjmlOutput = compiledHandlebarsTemplate(data);

    const { html, errors } = mjml2html(mjmlOutput);

    if (errors.length > 0) {
      console.warn('MJML rendering errors:', errors);
    }

    return html;
  }
}
