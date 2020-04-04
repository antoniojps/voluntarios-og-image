import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const url = req.url ? decodeURIComponent(req.url).replace(/&amp;/g, '&') : ''
    const { pathname = '/', query = {} } = parse(url, true);
    const { fontSize, images, widths, heights, theme, md } = query;

    if (Array.isArray(fontSize)) {
        throw new Error('Expected a single fontSize');
    }
    if (Array.isArray(theme)) {
        throw new Error('Expected a single theme');
    }

    const arr = pathname !== null ? pathname.slice(1).split('.') : []
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        extension = arr.pop() as string;
        text = arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
        theme: 'light',
        md: (md === '0' || md === 'false') ? false : true,
        fontSize: fontSize || '80px',
        images: getArray(images),
        widths: getArray(widths),
        heights: getArray(heights),
    };
    parsedRequest.images = getDefaultImages(parsedRequest.images);
    return parsedRequest;
}

function getArray(stringOrArray: string[] | string): string[] {
    return Array.isArray(stringOrArray) ? stringOrArray : [stringOrArray];
}

function getDefaultImages(images: string[]): string[] {
    if (
      images.length > 0 &&
      images[0] &&
      images[0].startsWith('https://voluntarios.app/')
    ) {
      return images
    }
    return ['https://voluntarios.app/voluntarios-dark.svg']
}