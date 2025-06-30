import { test as setup, expect} from '@playwright/test'

setup('create new artcile', async ({request}) => {
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/' , {
        data : {
            "article" : {
                "tagList" : [],
                "title" : "likes test article",
                "description" : "This is a test description",
                "body" : "this is a test body"
            }
        }
    })

    expect(articleResponse.status()).toEqual(201)

    const response = await articleResponse.json()
    const slug = response.artcile.slug
    console.log("SLUG ---> " + slug)
    process.env['SLUG'] = slug
})