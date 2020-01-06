import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Components
import MyButton from "../../util/myButton";
import DeletePost from "./deletePost";
import PostDialog from "./postDialog";
import ApproveButton from "./approveButton";

// Redux
import { connect } from "react-redux";

// MUI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
// Icons
import ChatIcon from "@material-ui/icons/Chat";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20
  },
  image: {
    minWidth: 200,
    objectFit: "cover"
  },
  content: {
    padding: 25
  }
};

const Post = props => {
  dayjs.extend(relativeTime);
  const { classes, authenticated, currentUserHandle, id, post } = props;

  const {
    userImage,
    body,
    userHandle,
    createdAt,
    commentCount,
    approveCount
  } = post;

  return (
    <Card className={classes.card}>
      <CardMedia
        image={userImage}
        title="Profile image"
        className={classes.image}
      />
      <CardContent className={classes.content}>
        <Typography
          variant="h5"
          component={Link}
          to={`/users/${userHandle}`}
          color="primary"
        >
          {userHandle}
        </Typography>
        {authenticated && userHandle === currentUserHandle && (
          <DeletePost postId={id} />
        )}
        <Typography variant="body2" color="textSecondary">
          {dayjs(createdAt).fromNow()}
        </Typography>
        <Typography variant="body1">{body}</Typography>
        <ApproveButton postId={id} approveCount={approveCount} />
        <MyButton tip="Comments">
          <ChatIcon color="primary" />
        </MyButton>
        <span>{commentCount}</span>
        <PostDialog postId={id} post={{ ...post }} />
      </CardContent>
    </Card>
  );
};

Post.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  currentUserHandle: PropTypes.string,
  post: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  currentUserHandle: state.user.credentials.handle
});

export default connect(mapStateToProps)(withStyles(styles)(Post));
