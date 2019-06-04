import * as React from "react";
import * as classnames from "classnames";
import { render } from "react-dom";
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import AppCard from '../components/AppCard';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';

import { CreateApp } from '../actions';
import { AppCreationSpec, defaultAppCreationSpec, AppResource } from '../types/app'
import snakecase from 'snakecase-keys'

const styles = (theme: Theme) =>
  createStyles({
      containerRoot: {
        marginTop:theme.spacing.unit * 5,
      },
      root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing.unit * 4,
      paddingBottom: theme.spacing.unit * 4,
      backgroundColor: "#dededf",
      border: '10px solid #016e76f7'
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    exampleCard: {
      marginLeft: 25 // -30
    },
    margin: {
      minWidth: '42vw',
      margin: '0 auto'
    },
    heading: {
      textAlign: 'center'
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
    progress: {
      margin: theme.spacing.unit * 2,
    },
    btn: {
      marginTop: 45,
      marginBottom: 5
    },
    leftColumn: {
      marginRight: 10,
    },
    rightColumn: {
      marginLeft: 10,
    },
    progressDialog:{
      minWidth: 150,
      minHeight: 150,
    }
  });


export interface Props extends WithStyles<typeof styles> {
  createApp: (app: AppCreationSpec) => Promise<string>,
  awaitingResponse: boolean,
}

export interface State {
  previewOpen: boolean,
  appInput: AppCreationSpec,
  uiUrl: string,
  uiHash: string,
  dnaUrl: string,
  dnas: Array<AppResource>
}

export type StateKeys = string | number | symbol | any;

class NewApp extends React.Component<Props, State> {
  public state: State = {
    previewOpen: false,
    appInput: defaultAppCreationSpec,
    uiUrl: '',
    dnaUrl: '',
    uiHash: '',
    dnas: [{
      location: '',
      hash: '',
      handle: ''
    }]
  }

  public render() {
    const { classes } = this.props;
    return (
      <Grid className={classes.containerRoot}
        container={true}
        spacing={16}
        direction="row"
        alignItems="center"
        justify="center" // space-evenly
      >
      <Paper className={classes.root}>
        <Grid item={true} xs={12}>
          <Typography variant="h4" component="h3" className={classes.heading}>
            Provide the following details to post a new hApp to the store
          </Typography>
          <Typography component="caption" className={classes.heading}>
            Keep in mind that anything submitted will be visible to all participants for the lifetime of the hApp store.<br/>
            Please be considerate, check submissions carefully and keep cruft to a minimum.
          </Typography>
        </Grid>

        <Grid
          container={true}
          spacing={24}
          direction="row"
          alignItems="center"
          justify="center"
        >
          <form>
            <Grid container={true} direction="column" justify="center" alignItems="center">
                <Grid item={true} xs={12}>
                  <TextField
                    id="title-field"
                    required={true}
                    label="Title"
                    value={this.state.appInput.title}
                    onChange={this.handleHappInfoChange('title')}
                    className={classes.textField}
                  />
                </Grid>

                <Grid item={true} xs={12}>
                    <TextField
                      id="description-field"
                      label="Description"
                      multiline={true}
                      fullWidth={true}
                      value={this.state.appInput.description}
                      onChange={this.handleHappInfoChange('description')}
                      className={classes.textField}
                    />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    id="thumburl-field"
                    label="Thumbnail URL"
                    value={this.state.appInput.thumbnailUrl}
                    onChange={this.handleHappInfoChange('thumbnailUrl')}
                    className={classes.textField}
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    id="homepage-field"
                    required={true}
                    label="hApp Homepage URL"
                    value={this.state.appInput.homepageUrl}
                    onChange={this.handleHappInfoChange('homepageUrl')}
                    className={classes.textField}
                  />
                </Grid>

                <Grid item={true} xs={12}>
                  <TextField
                    id="ui-field"
                    label="UI URL (zip file)"
                    value={this.state.uiUrl || ''}
                    onChange={this.handleUiChange('uiUrl')}
                    className={classes.textField}
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    id="ui-field"
                    label="UI Hash"
                    value={this.state.uiHash || ''}
                    onChange={this.handleUiChange('uiHash')}
                    className={classes.textField}
                  />
                </Grid>

                <br/>
                <br/>
                <Typography component="caption" className={classes.heading}>
                  Please add the Hash and URL for each DNA service included in your hApp Bundle.
                </Typography>
                <div>
                  <span onClick={this.addDnaLine} style={{display:'inline-flex'}}>
                    <AddIcon style={{color:'#0e094b'}}/>
                  </span>
                  <span onClick={this.removeDnaLine} style={{display:'inline-flex'}}>
                    <RemoveIcon style={{color:'#0e094b'}}/>
                  </span>
                </div>

                <Grid container={true} direction="row" justify="flex-end">
                  <div>
                    <Grid container={true} direction="column" justify="flex-end">
                      <Grid item={true} xs={6}>
                        <FormControl>
                           {this.state.dnas.map((value, i) => (
                             <TextField
                               key={i}
                               id="dna-field"
                               required={true}
                               label="DNA URL (dna.json file)"
                               value={(this.state.dnas[i]! || {location: ''} as any).location}
                               onChange={this.handleDnaChange(i, "location")}
                               className={classes.textField}
                             />
                           ))}
                         </FormControl>
                      </Grid>
                    </Grid>
                  </div>

                  <div>
                    <Grid container={true} direction="column" justify="flex-end">
                      <Grid item={true} xs={6}>
                        <FormControl>
                           {this.state.dnas.map((value, i) => (
                             <TextField
                               key={i}
                               id="dna-field"
                               required={true}
                               label="DNA Hash"
                               value={(this.state.dnas[i]! || {hash: ''} as any).hash}
                               onChange={this.handleDnaChange(i,"hash")}
                               className={classes.textField}
                             />
                           ))}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>

                  <div>
                    <Grid container={true} direction="column" justify="flex-end">
                      <Grid item={true} xs={6}>
                        <FormControl>
                           {this.state.dnas.map((value, i) => (
                             <TextField
                               key={i}
                               id="dna-field"
                               required={true}
                               label="DNA Handle ID"
                               value={(this.state.dnas[i]! || {handle: ''} as any).handle}
                               onChange={this.handleDnaChange(i,"handle")}
                               className={classes.textField}
                             />
                           ))}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </form>

          <br/>
          <Grid container={true} direction="column" alignItems="center" justify="center" className={classes.btn}>
            <Grid item={true} xs={12}>
              <Button variant="contained" size="large" color="primary" onClick={this.handleClickSubmit(this.state.appInput)}>
                  Submit
              </Button>
            </Grid>
          </Grid>

          </Grid>
        </Paper>

        <Paper className={classnames(classes.root, classes.exampleCard)}>
          <AppCard app={ {
            author: "<your holochain ID will go here>",
              address: "",
              upvotes: 0,
              upvotedByMe: false,
              appEntry: this.state.appInput
          }}/>
        </Paper>

        <Dialog open={this.props.awaitingResponse} className={classes.progressDialog}>
          <CircularProgress className={classes.progress}/>
        </Dialog>
      </Grid>
    );
  }

  private addDnaLine = () => {
    // hack to add add'l lines... refactor
    const addedDNAEntry:Array<AppResource> = this.state.dnas;
    addedDNAEntry.push({location:'', hash:'', handle:''});

    this.setState({
      dnas: addedDNAEntry
    });
  }
  private removeDnaLine = () => {
    // hack to add add'l lines... refactor
    if(this.state.dnas.length >= 1) {
      const removeDNAEntry:Array<AppResource> = this.state.dnas;
      removeDNAEntry.pop();
      this.setState({
        dnas: removeDNAEntry
      });
    }
  }

  private handleDnaChange = (dnaNum:number, type:string ) => (event: any) => {
    const value = event.target.value;
    const newDnaList = this.state.dnas;
    const currentDNA = newDnaList[dnaNum]
    currentDNA[type] = value;
    newDnaList[dnaNum]=currentDNA;
    // const currentDNAvalue = currentDNA[type] = value;
    // console.log("currentDNA value", currentDNAvalue);

    this.setState({ dnas: newDnaList });
    console.log(this.state);
  };
  private handleUiChange = (title:StateKeys) => (event: any) => {
    const value = event.target.value;
    this.setState({ [title]: value } as Pick<State, keyof State>);
  };
  private handleHappInfoChange = (name: keyof AppCreationSpec) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const update = { ...this.state.appInput, [name]: value };
    this.setState({ appInput: update as AppCreationSpec});
  }

  private handleClickSubmit = (app: AppCreationSpec) => (event: any) => {
    const appWithFiles = { ...app, dnas: this.state.dnas, ui: { location: this.state.uiUrl, hash: this.state.uiHash } }
    console.log("app to be registered in happ store", appWithFiles);

    this.props.createApp(appWithFiles).then(() => {
      // @ts-ignore
      this.props.history.push('/')
    })
  }

  private handleSetPreviewState = (open: boolean) => (event: any) => {
    this.setState({previewOpen: open})
  }

  private clearValues = () => {
    this.setState({
      uiUrl: '',
      uiHash: '',
      dnas: [{
        location: '',
        hash: '',
        handle: ''
      }]
    })
  }
}

const mapStateToProps = ({ awaitingResponse }) => ({ awaitingResponse });
const mapDispatchToProps = dispatch => ({
  createApp: (app: AppCreationSpec) => dispatch(CreateApp.create(snakecase(app))),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(NewApp)));
