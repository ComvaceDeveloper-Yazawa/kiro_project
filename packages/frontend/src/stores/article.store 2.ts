import { defineStore } from 'pinia';
import type { Article } from '@monorepo/shared';

interface ArticleState {
  articles: Article[];
  currentArticle: Article | null;
  cache: Map<string, { article: Article; timestamp: number }>;
  cacheTTL: number; // キャッシュの有効期限（ミリ秒）
}

export const useArticleStore = defineStore('article', {
  state: (): ArticleState => ({
    articles: [],
    currentArticle: null,
    cache: new Map(),
    cacheTTL: 5 * 60 * 1000, // 5分
  }),

  getters: {
    getArticleById: (state) => (id: string) => {
      // キャッシュから取得
      const cached = state.cache.get(id);
      if (cached && Date.now() - cached.timestamp < state.cacheTTL) {
        return cached.article;
      }
      // メモリから取得
      return state.articles.find((article) => article.id === id);
    },

    publishedArticles: (state) => {
      return state.articles.filter((article) => article.isPublished);
    },

    draftArticles: (state) => {
      return state.articles.filter((article) => !article.isPublished);
    },

    articlesByTag: (state) => (tagName: string) => {
      return state.articles.filter((article) => article.tags.includes(tagName));
    },
  },

  actions: {
    setArticles(articles: Article[]) {
      this.articles = articles;
    },

    addArticle(article: Article) {
      const index = this.articles.findIndex((a) => a.id === article.id);
      if (index !== -1) {
        this.articles[index] = article;
      } else {
        this.articles.push(article);
      }
      // キャッシュに追加
      this.cache.set(article.id, {
        article,
        timestamp: Date.now(),
      });
    },

    updateArticle(article: Article) {
      const index = this.articles.findIndex((a) => a.id === article.id);
      if (index !== -1) {
        this.articles[index] = article;
      }
      // キャッシュを更新
      this.cache.set(article.id, {
        article,
        timestamp: Date.now(),
      });
      // currentArticleも更新
      if (this.currentArticle?.id === article.id) {
        this.currentArticle = article;
      }
    },

    removeArticle(id: string) {
      this.articles = this.articles.filter((article) => article.id !== id);
      this.cache.delete(id);
      if (this.currentArticle?.id === id) {
        this.currentArticle = null;
      }
    },

    setCurrentArticle(article: Article | null) {
      this.currentArticle = article;
      if (article) {
        // キャッシュに追加
        this.cache.set(article.id, {
          article,
          timestamp: Date.now(),
        });
      }
    },

    clearCache() {
      this.cache.clear();
    },

    clearExpiredCache() {
      const now = Date.now();
      for (const [id, cached] of this.cache.entries()) {
        if (now - cached.timestamp >= this.cacheTTL) {
          this.cache.delete(id);
        }
      }
    },

    clear() {
      this.articles = [];
      this.currentArticle = null;
      this.cache.clear();
    },
  },
});
