defmodule Blog.PostsTest do
  @moduledoc """
  Blogs tests
  """
  use Blog.DataCase
  alias Blog.{Accounts, Posts, Posts.Post}

  @valid_post %{
    title: "Post 1",
    description: "Description 1"
  }
  @update_post %{
    title: "Updated title",
    description: "Updated description"
  }

  def user_fixture do
    {:ok, user} =
      Accounts.create_user(%{
        email: "itor isaias",
        provider: "local",
        token: "token-fake"
      })

    user
  end

  def post_fixture(attrs \\ %{}) do
    user = user_fixture()
    {:ok, post} = Posts.create_post(user, Map.merge(@valid_post, attrs))

    post
  end

  test "create_post/2 with valid data" do
    user = user_fixture()
    assert {:ok, %Post{} = post} = Posts.create_post(user, @valid_post)
    assert post.title == "Post 1"
    assert post.description == "Description 1"
  end

  test "list_posts/0 return all posts" do
    post = post_fixture()
    assert Posts.list_posts() == [post]
  end

  test "get_post!/1 return post detail" do
    post = post_fixture()
    assert Posts.get_post!(post.id) == post
  end

  test "update_post/2 with valid data" do
    post = post_fixture()
    assert {:ok, %Post{} = post} = Posts.update_post(post.id, @update_post)
    assert post.title == "Updated title"
    assert post.description == "Updated description"
  end

  test "delete_post!/1 " do
    post = post_fixture()
    assert post = Posts.delete_post!(post.id)
    assert_raise Ecto.NoResultsError, fn -> Posts.get_post!(post.id) end
  end
end
