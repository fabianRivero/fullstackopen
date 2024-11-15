import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('submit <BlogForm /> calls event handler recived as props with the correct details', async () => {
  const createBlog = vi.fn()
  const testUser = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')

  const sendButton = screen.getByText('create')

  await testUser.type(titleInput, 'testing title form')
  await testUser.type(authorInput, 'testUser')
  await testUser.type(urlInput, 'http://url.com')
  await testUser.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toStrictEqual({title: "testing title form", author: "testUser", url: "http://url.com" })
})