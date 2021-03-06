// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import {
  Socket
} from "phoenix";

let socket = new Socket("/socket", {
  params: {
    token: window.userToken
  }
});

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, connect to the socket:
socket.connect();

function createSocket(post_id) {
  const listComments = document.querySelector(".collection");
  const btnComment = document.getElementById("btn-comentar");
  const inputComment = document.getElementById("comentario");
  const channel = socket.channel(`comments:${post_id}`, {});

  function templateComment({
    content,
    user
  }) {
    return `
    <li class="collection-item avatar">
      <img src="${user.image}" alt="Foto do usuario ${user.email}" class="circle" />
      <span class="title">${user.email}</span>
      <p>${content}</p>
    </li>
    `;
  }

  function onCreateComment(event) {
    event.preventDefault()

    const comentario = inputComment.value;

    channel.push("comment:add", {
      content: comentario
    });

    inputComment.value = "";
  }

  function onNewComment(newComment) {
    console.log(newComment);
    listComments.innerHTML += templateComment(newComment);
  }

  function onJoinSuccess({
    comments
  }) {
    console.log(comments)
    listComments.innerHTML = comments
      .map((comment) => templateComment(comment))
      .join("");
  }

  function onJoinFalied(resp) {
    console.log("Unable to join", resp);
  }

  window.userToken && btnComment.addEventListener("click", onCreateComment);

  channel.join().receive("ok", onJoinSuccess).receive("error", onJoinFalied);

  channel.on(`comments:${post_id}:new`, onNewComment);
}

window.createSocket = createSocket;

export default socket;
