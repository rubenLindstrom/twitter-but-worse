import React from "react";
import PropTypes from "prop-types";
import NoAvatar from "../images/no-avatar.png";
import withStyles from "@material-ui/core/styles/withStyles";

// MUI
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";

const styles = theme => ({
  ...theme.skeleton
});

const postSkeleton = props => {
  const { classes } = props;

  const content = Array.from({ length: 5 }).map((el, index) => (
    <Card className={classes.card} key={index}>
      <CardMedia className={classes.cover} image={NoAvatar} />
      <CardContent className={classes.cardContent}>
        <div className={classes.handle} />
        <div className={classes.date} />
        <div className={classes.fullLine} />
        <div className={classes.fullLine} />
        <div className={classes.halfLine} />
      </CardContent>
    </Card>
  ));

  return <>{content}</>;
};

postSkeleton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(postSkeleton);
