const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Fabian Rivero',
        username: 'fabianRivero',
        password: 'password123'
      }
    })

    await request.post('/api/users', {
      data: {
        name: 'User',
        username: 'user',
        password: 'user'
      }
    })

    await page.goto('/')
  })


  test('Login form is shown', async ({ page }) => {
    const loginTitle = await page.getByText('Log in to application')
    const usernameInput = await page.getByTestId('username')
    const passwordInput = await page.getByTestId('password')
    await expect(loginTitle).toBeVisible()
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'fabianRivero', 'password123')

      await expect(page.getByText('Fabian Rivero logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'fabianRivero', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await loginWith(page, 'wrongUser', 'password123')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'fabianRivero', 'password123')
      await createBlog(page, 'a blog created by playwright', 'Fabian Rivero', 'http://test.com', true)
    })
  
    test('a new blog can be created', async ({ page }) => {
      const newBlog = await page.getByTestId('newBlog')

      await expect(newBlog.getByText('a blog created by playwright Fabian Rivero')).toBeVisible()
    })

    test('a blog can be edited', async ({ page }) => {
      const newBlog = await page.getByTestId('newBlog')
      await newBlog.getByRole('button', { name: 'view' }).click()
      
      await expect(page.getByText('Likes:0')).toBeVisible()

      await newBlog.getByRole('button', { name: 'Like' }).click()
      
      await expect(page.getByText('Likes:1')).toBeVisible()
    }) 
    
    test('the blog author can delete the blog', async ({ page }) => {
      const blogToDelete = await page.getByTestId('newBlog')
      await blogToDelete.getByRole('button', { name: 'view' }).click()
      await expect(blogToDelete.getByRole('button', { name: 'remove' })).toBeVisible()

      page.on('dialog', async (dialog) => {
        console.log(`Mensaje del diálogo: ${dialog.message()}`)
        await dialog.accept()
    })

      await blogToDelete.getByRole('button', { name: 'remove' }).click()
      
      await expect(page.getByText('a blog created by playwright Fabian Rivero')).not.toBeVisible()      
    }) 
    
    test('only the blog creator can see the "remove" button', async ({ page }) => {
      const blog = await page.getByTestId('newBlog')
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole("button", {name: "log out"}).click()

      await loginWith(page, 'user', 'user')
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })
  describe('blog list order', () => {
    test('The list of blogs is ordered from most to least likes', async ({ page }) => {
      await loginWith(page, 'fabianRivero', 'password123')

      await page.getByRole('button', { name: 'New blog' }).click()

      await page.getByTestId('title').fill("0 likes blog")
      await page.getByTestId('author').fill("Fabian Rivero")
      await page.getByTestId('url').fill("http://test.com")
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByText("0 likes blog Fabian Rivero").waitFor()

      await page.getByTestId('title').fill("1 like blog")
      await page.getByTestId('author').fill("Fabian Rivero")
      await page.getByTestId('url').fill("http://test.com")
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByText("1 like blog Fabian Rivero").waitFor()

      await page.getByTestId('title').fill("2 likes blog")
      await page.getByTestId('author').fill("Fabian Rivero")
      await page.getByTestId('url').fill("http://test.com")
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByText("2 likes blog Fabian Rivero").waitFor()

      const orderBefore = await page.$$eval('ul li', (elements) => {
        return elements.map((el) => el.textContent)
      })

      expect(orderBefore).toStrictEqual(
        [
        '0 likes blog Fabian Rivero viewhttp://test.comLikes:0LikeFabian Riveroremove',
        '1 like blog Fabian Rivero viewhttp://test.comLikes:0LikeFabian Riveroremove',
        '2 likes blog Fabian Rivero viewhttp://test.comLikes:0LikeFabian Riveroremove'
        ])

      page.locator('li').filter({ hasText: '1 like blog' }).getByRole('button',  { name: 'view' }).click()
      page.locator('li').filter({ hasText: '1 like blog' }).getByRole('button',  { name: 'Like' }).click()
      await page.locator('li').filter({ hasText: '1 like blog' }).getByText("Likes:1").waitFor()

      page.locator('li').filter({ hasText: '2 likes blog' }).getByRole('button',  { name: 'view' }).click()
      page.locator('li').filter({ hasText: '2 likes blog' }).getByRole('button',  { name: 'Like' }).click()
      await page.locator('li').filter({ hasText: '2 likes blog' }).getByText("Likes:1").waitFor()
      page.locator('li').filter({ hasText: '2 likes blog' }).getByRole('button',  { name: 'Like' }).click()
      await page.locator('li').filter({ hasText: '2 likes blog' }).getByText("Likes:2").waitFor()

      const orderAfter = await page.$$eval('ul li', (elements) => {
        return elements.map((el) => el.textContent)
      })
      expect(orderAfter).toStrictEqual(
        [
        '2 likes blog Fabian Rivero hidehttp://test.comLikes:2LikeFabian Riveroremove',
        '1 like blog Fabian Rivero hidehttp://test.comLikes:1LikeFabian Riveroremove',
        '0 likes blog Fabian Rivero viewhttp://test.comLikes:0LikeFabian Riveroremove'
        ])
    })   
  })
})
