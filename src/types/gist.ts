/**
 * Type definitions for GitHub Gist integration
 */

export interface GistProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  photoUrl: string;
  strikeFund: {
    id: string;
    url: string;
    title: string;
    description: string;
    category: string;
    urgency: string;
    currentAmount: number;
    targetAmount: number;
  };
}

export interface GistResponse {
  html_url: string;
  files: {
    [filename: string]: {
      content: string;
    };
  };
}

export interface GistError {
  message: string;
  documentation_url?: string;
}
