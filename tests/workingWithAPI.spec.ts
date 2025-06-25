import { test, expect, request } from '@playwright/test';
import tags from "../test-data/tags.json"

/* testUser information:
- username: cesar@test.com
- password: test0001

test article has been created.
 */

test.beforeEach(async ({page}) => {
  // creation of a mock API
  // await page.route('https://conduit-api.bondaracademy.com/api/tags', async route => {
  //   await page.route('*/**/api/tags', async route => {
  //     const response = tags
  //     await route.fulfill({
  //     body: JSON.stringify(response)
  //   })
  // })

  await page.goto('https://conduit.bondaracademy.com/');

  // await page.getByText('Sign in').click()
  // await page.getByRole('textbox', {name: 'Email'}).fill('cesar@test.com')
  // await page.getByRole('textbox', {name: 'Password'}).fill('test0001')
  // await page.getByRole('button').click()

})

test('working with MOCK API', async ({ page }) => {
    await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = 'This is a MOCK test title'
    responseBody.articles[0].description = 'This is a MOCK description'

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })

    await page.getByText('Global Feed').click()
    await expect(page.locator('.navbar-brand')).toHaveText('conduit')
    await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title')
    await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK description')
    // await page.waitForTimeout(1000)
})

test('create article', async ({page, request}) => {
  // const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  //   // on playwright the data attribute is the requestBody
  //   data: {
  //     "user":{"email":"cesar@test.com","password":"test0001"}
  //   }        
  // })
  // const responseBody = await loginResponse.json()
  // const accessToken = responseBody.user.token

  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article":{
        "title":"This is a test article",
        "description":"This is a test description",
        "body":"This is a test body",
        "tagList":[]
      }
    },
    // headers: {
    //   Authorization: `Token ${accessToken}`
    // }
  })

  expect(articleResponse.status()).toEqual(201)

  // this part delete the article using the UI
  await page.getByText('Global Feed').click()
  await page.getByText('This is a test article').click()
  await page.getByRole('button', {name: 'Delete Article'}).first().click()
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list h1').first()).not.toContainText('This is a test article')

})


test('delete article', async ({page, request}) => {
  await page.getByText('New Article').click()
  await page.getByRole('textbox', {name: 'Article Title'}).fill('Playwright is Awesome')
  await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('About Playwright')
  await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('I like to use playwright for automation')
  await page.getByRole('button', {name: 'Publish Article'}).click()

  const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/**')
  const articleResponseBody = await articleResponse.json()
  // console.log('articleResponseBody: ' + JSON.stringify(articleResponseBody))
  const slug = articleResponseBody.article.slug

  await expect(page.locator('.article-page h1')).toContainText('Playwright is Awesome')
  await page.getByText('Home').click()
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is Awesome')

  // const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  //   // on playwright the data attribute is the requestBody
  //   data: {
  //     "user":{"email":"cesar@test.com","password":"test0001"}
  //   }        
  // })
  // const responseBody = await loginResponse.json()
  // const accessToken = responseBody.user.token

  const delteArticleResponse = await request.delete('https://conduit-api.bondaracademy.com/api/articles/' + slug, {
    // headers: {
    //   Authorization: `Token ${accessToken}`
    // }
  })

  expect(delteArticleResponse.status()).toEqual(204)

})
