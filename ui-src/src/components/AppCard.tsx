import * as React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import red from '@material-ui/core/colors/red'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import FavoriteIconOutline from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteIconShaded from '@material-ui/icons/Favorite';
import Tooltip from '@material-ui/core/Tooltip';

import { App, defaultAppCreationSpec } from '../types/app'

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  title: {
    fontSize: 8,
    marginTop:10
  },
});

interface Props {
	classes: any,
	app: App,
  upvoteApp: (app: App) => Promise<string>
  getManifest: (app: App) => Promise<string>
}

class AppCard extends React.Component<Props> {

  public render() {
    const { classes, app } = this.props;
    const appEntry = app.appEntry || defaultAppCreationSpec;

    const DnaDownloadButton = (dna, key) => (
      <Button size="small" color="primary" href={dna.location} key={key}>
        Download DNA #{key + 1}
      </Button>
    )

    return (
      <Card className={classes.card}>
        <CardHeader
          title={appEntry.title}
          subheader={app.author}
          action={
            <Tooltip title={this.props.app.upvotes}>
              <IconButton onClick={this.handleUpvoteClick}>
                {this.props.app.upvotedByMe ? <FavoriteIconShaded fontSize="large"/> : <FavoriteIconOutline fontSize="large"/>}
              </IconButton>
            </Tooltip>
          }
        />
        <CardMedia
          className={classes.media}
          image={appEntry.thumbnailUrl}
          title="hApp Image"
        />
        <CardContent>
          <Typography component="p">
            {appEntry.description}
          </Typography>
          <Typography component="p" className={classes.title}>
            hApp Bundle ID: {app.address || ""}
          </Typography>
        </CardContent>
        <hr style={{margin:"5px auto", width:"95%"}}/>
        <CardActions className={classes.actions} disableActionSpacing={true}>
          { appEntry.dnas.map(DnaDownloadButton) }
          { appEntry.ui
            ? <Button size="small" color="primary" href={appEntry.ui.location}>
    	          Download UI
    	        </Button>
            : null }
	        <Button size="small" color="primary" href={appEntry.homepageUrl}>
	          Visit Homepage
	        </Button>
          <Button size="small" color="primary" onClick={this.handleGetManifest}>
	          Download Manifest
	        </Button>
        </CardActions>
      </Card>
    );
  }

  private handleUpvoteClick = () => {
    console.log("upvoting", this.props.app)
    return this.props.upvoteApp(this.props.app)
  }
  private handleGetManifest = () => {
    this.props.getManifest(this.props.app).then((r)=>{
      console.log("Manifest: ",r)
      alert(`Manifest: ${JSON.stringify(r)}`)
    })
  }
}

import { UpvoteApp, GetManifest } from '../actions'

const mapStateToProps = (state) => ({ });

const mapDispatchToProps = dispatch => ({
  upvoteApp: (app: App) => dispatch(UpvoteApp.create({app_address: app.address})),
  getManifest: (app: App) => dispatch(GetManifest.create({app_hash: app.address})),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AppCard));
