import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import dataActions from "../../redux/actions/dataActions";

// MUI
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  ...theme.custom
});

const CommentForm = props => {
  const [body, setBody] = useState("");

  const { errors, authenticated, submitComment, classes, postId } = props;

  useEffect(() => {}, []);

  // TODO: Disable submitbutton when submitting
  const handleSubmit = e => {
    e.preventDefault();
    submitComment(postId, { body }).then(res => res.success && setBody(""));
  };

  return !authenticated ? null : (
    <Grid item sm={12}>
      <form onSubmit={handleSubmit}>
        <TextField
          name="body"
          onChange={e => setBody(e.target.value)}
          type="text"
          label="Comment on post"
          error={errors.comment ? true : false}
          helperText={errors.comment}
          fullWidth
          className={classes.textField}
          value={body}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Submit
        </Button>
      </form>
      <hr className={classes.visibleSeparator} />
    </Grid>
  );
};

CommentForm.propTypes = {
  errors: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  submitComment: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  errors: state.ui.errors,
  authenticated: state.user.authenticated
});

const mapDispatch = {
  submitComment: dataActions.submitComment
};

export default connect(
  mapStateToProps,
  mapDispatch
)(withStyles(styles)(CommentForm));
