import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  // const [posts, setPosts] = useState([
  //   {
  //     username: 'jahangir',
  //     caption: 'picnic day in our university memories.',
  //     imageUrl:
  //       'https://lh3.googleusercontent.com/zF2Pc_IlWo-a7qqHHC_xyF3-M0VK1KjuT5FdEZp0oDp7NlOR1edip5-sxI7jf0OZcbfK0W4unm4SMH6E6OwG1Ul8An8o7HC1pPur4Oos2N_wzGCGyXBZit9COMaRv99cWrOqWuyN9b0reCCQq1oZr3IK3zg9fYL5DJAxEz45NzrEai-zXDWMW0_3qwUlr_FnIAjhiojUey7KJMXoDcVBUeXnHpXbbnz06_NqAGTINmvC3mXyOEoytSocu8z_g_cvR9vhZdiSh_ZeypAfEi45XJv-vfml1uN6erM92L_moyZ1tVjKDz9AHj3LxTzLFzovHhTOVatwf0gbt5sLCuhw96sQuQzlLabuG0HgVNxZaLm4CCKoCO0KW5GlRQxcPiiNAIUPcj3HiwlvsNe3PNdxH5nt-TPzdW6nGcM_0pk6rVV2H0Rj9UN4jvGlJOLa2-k__oddqroWkxy_kwZJdKF07Y4ubm73LrveH08tDKDe809QNgzRlvt_nxFMtGfp0J1Wmu1SlWac0zW6b8YeT0ge6qJul2iLGG_cbsgLDPQ-ZIxWnZbwUHfIzWM2GGIxqimGrcn4_Wu3uxSZfik21Teq3dNY-dVIdkchFZvmQVqWnMxhmidXQo6CK78kymdXK_nctmytXEfpajhOpC06y6HgRcI-qOO3uXkIm7kTX7PL9Zz2grtLg_ZJl-P-F8mkNA=w672-h503-no?authuser=0',
  //   },
  //   {
  //     username: 'imran',
  //     caption: 'DOPE.',
  //     imageUrl:
  //       'https://lh3.googleusercontent.com/WkYIhQJ3KMpcJOqu37-U25ZFRnGfa4PuRxlRH8nUtsJw0jfihL1zpXnid-pWIrVsR0IH9Ev8kufXdvD6apTmI3Zb6WDFGGsZm-DUrpRg2t5S-_IvG4EFlvcwHIsEvhNKnKVn1GYB4kV3tK6IzM5NJRNPXE2s9NTUGcFQKPvR611Q-8FdrLm-iygcnqRdcPHacFWpM1SAEfWwQx09j7OBUBWipKmABPHucKJAG3ToaoCGpMVzQNGw3AEETJiM1ywohJO44se-gKhcpphN04sg9ZSqjzlhhKR7uSu3o2BfVbM9xeMn2PXzYMww84jy5952pFsbKfWqIfpUFMJ9BoNEgcTN4rTb8wq1qtpHcbPsKBelv6x2gqHYVPsczaue08n8gnglDfLXlowSn6Z5X3Q-Y9fYKFhwaEeEKUrOVb9tQdCSjr6mbiiLVbRNLnMrwWf1iE5EUaUvSvCTG-diyaRVRTNM4yFf_bBB9M54BxiFM7bqQB7rQxFW-RhcYUNEkvoJZT6ZcgngiP1oGxbaqPqJX3tOiahGAscPwvQZ5nUWz3IJyfPQOcq9nvk-9lxqW1YT0PdvLwOe_hQLuK9vukDOxZEEU8DM8gZhXIRbqC_2DmOnfDo8OKb-eyJRUsDyU_y4oN4JrLfMQZhXkPr2K2HwZxix9V1etluQqzbQKa2UAWpcqh_6x9T4XpnSlhUw5g=w422-h564-no?authuser=0',
  //   },
  // ]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
        if (authUser.displayName) {
        } else {
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  // posts data comming from firebase realtime database and set to local state.
  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  // cookies sessionid or csrf token keep track us in order to sign up.
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)

      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div className="app">
      {/* Create a post */}
      {/* <ImageUpload username={user.displayName} /> */}

      {/* {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )} */}

      {/* {console.log(`user : ${user}`)}
      {console.log(`username : ${username}`)} */}

      {/* Sign up modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram logo"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign up
            </Button>
          </form>
        </div>
      </Modal>

      {/* Sign in modal */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram logo"
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      {/* Header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram logo"
        />

        {/* login and logout */}
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Login</Button>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
          </div>
        )}
      </div>

      

      {/* Posts */}
      {/* {posts.map((post) => (
        <Post
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))} */}

      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="app_postsRight">
          <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            clientAccessToken='123|456'
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login for creating post !!</h3>
      )}
    </div>
  );
}

export default App;
