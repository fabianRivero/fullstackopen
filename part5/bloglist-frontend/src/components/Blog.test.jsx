import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('shows only title and author initially', () => {
  const blog = {
    title: 'title',
    author: "author",
    url: "http://test.com",
    likes: 10
  }

  const user ={
    username: "testUser",
    name: "user"
  }

  const { container } = render(<Blog blog={blog} user={user}/>)

  const element = screen.getByText('title author')
  //screen.debug(element)

  const TogglableElement = container.querySelector('#togglable-part')

  expect(element).toBeDefined()
  expect(TogglableElement).toHaveStyle('display: none')

})

test('clicking the button shows the url and likes', async () => {
    const blog = {
        title: 'title',
        author: "author",
        url: "http://test.com",
        likes: 10,
        user: {username: "testUser"}
      }
    
      const user ={
        username: "testUser",
        name: "user"
      }
    
    const { container } = render(<Blog blog={blog} user={user}/>)
 
    const TogglableElement = container.querySelector('#togglable-part')

    const testUser = userEvent.setup()
    const button = screen.getByText('view')
    await testUser.click(button)

    expect(TogglableElement).toHaveStyle('display: block')
  })

  test('clicking the "like" button 2 times calls event handler twice', async () => {
    const blog = {
        title: 'title',
        author: "author",
        url: "http://test.com",
        likes: 10,
        user: {username: "testUser"}
      }
    
      const user ={
        username: "testUser",
        name: "user"
      }


    const mockHandler = vi.fn()

    render(
    <Blog blog={blog} user={user} likeFunction={mockHandler} />
    )

    const testUser = userEvent.setup()
    const button = screen.getByText('Like')
    await testUser.click(button)
    await testUser.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
    
  })