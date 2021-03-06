import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Logo from "../images/logo.png";

// Redux
import { connect } from "react-redux";
import userActions from "../redux/actions/userActions";

// MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  ...theme.custom
});

const Signup = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [handle, setHandle] = useState("");

  const {
    classes,
    signup,
    history,
    ui: { loading, errors }
  } = props;

  const handleSubmit = e => {
    e.preventDefault();
    signup({ email, password, confirmPassword, handle }, history);
  };

  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm>
        <img src={Logo} alt="happy smiley" className={classes.image} />
        <Typography variant="h2" className={classes.pageTitle}>
          Signup
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            className={classes.textField}
            value={email}
            onChange={e => setEmail(e.target.value)}
            helperText={errors.email}
            error={errors.email ? true : false}
            fullWidth
          />
          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            className={classes.textField}
            value={password}
            onChange={e => setPassword(e.target.value)}
            helperText={errors.password}
            error={errors.password ? true : false}
            fullWidth
          />
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            className={classes.textField}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            helperText={errors.confirmPassword}
            error={errors.confirmPassword ? true : false}
            fullWidth
          />
          <TextField
            id="handle"
            name="handle"
            type="text"
            label="Handle"
            className={classes.textField}
            value={handle}
            onChange={e => setHandle(e.target.value)}
            helperText={errors.handle}
            error={errors.handle ? true : false}
            fullWidth
          />
          {errors.general && (
            <Typography variant="body2" className={classes.customError}>
              {errors.general}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={loading}
          >
            Signup
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <br />
          <small>
            Already have an account? Log in <Link to="/signup">here</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
};

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  signup: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  ui: state.ui
});

const mapDispatch = {
  signup: userActions.signup
};

export default connect(
  mapStateToProps,
  mapDispatch
)(withStyles(styles)(Signup));
