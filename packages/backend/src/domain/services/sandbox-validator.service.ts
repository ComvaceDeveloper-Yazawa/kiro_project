export type SandboxType = 'stackblitz' | 'codesandbox';

export class SandboxValidatorService {
  private readonly ALLOWED_DOMAINS = {
    stackblitz: ['stackblitz.com'],
    codesandbox: ['codesandbox.io'],
  };

  /**
   * サンドボックスURLが有効かどうかを検証する
   */
  validateUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      // 許可されたドメインのいずれかに一致するか確認
      for (const domains of Object.values(this.ALLOWED_DOMAINS)) {
        if (domains.some((domain) => hostname.endsWith(domain))) {
          return true;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * サンドボックスURLから埋め込みコードを生成する
   */
  generateEmbedCode(url: string, type: SandboxType): string {
    if (!this.validateUrl(url)) {
      throw new Error('無効なサンドボックスURLです');
    }

    const embedUrl = this.convertToEmbedUrl(url, type);

    return `<iframe
  src="${embedUrl}"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="${type} embed"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>`;
  }

  /**
   * 通常のURLを埋め込み用URLに変換する
   */
  private convertToEmbedUrl(url: string, type: SandboxType): string {
    const parsedUrl = new URL(url);

    switch (type) {
      case 'stackblitz':
        // https://stackblitz.com/edit/xxx -> https://stackblitz.com/edit/xxx?embed=1
        if (!parsedUrl.searchParams.has('embed')) {
          parsedUrl.searchParams.set('embed', '1');
        }
        return parsedUrl.toString();

      case 'codesandbox':
        // https://codesandbox.io/s/xxx -> https://codesandbox.io/embed/xxx
        return url.replace('/s/', '/embed/');

      default:
        return url;
    }
  }
}
