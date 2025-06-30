import { test as setup, request, expect } from '@playwright/test'

setup('delete article', async ({request}) => {
     const delteArticleResponse = await request.delete('https://conduit-api.bondaracademy.com/api/articles/' + process.env.SLUG)
     expect(delteArticleResponse.status()).toEqual(204)
})