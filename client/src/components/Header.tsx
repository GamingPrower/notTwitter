import React from 'react'
import { Grid, AppBar, Toolbar, Typography, makeStyles, Theme, createStyles } from '@material-ui/core'
import AccessibleForwardIcon from '@material-ui/icons/AccessibleForward'
import GoogleAuth from './GoogleAuth';


interface HeaderProps {

}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		typographyStyles: {
			display: 'inline'
		}
	})
);

const Header: React.FC<HeaderProps> = () => {
	const classes = useStyles();

	return (
		<AppBar position="static">
			<Toolbar>
				<Grid container>
					<Grid item xs={undefined} sm={1}></Grid>
					<Grid item xs={4} sm={3}><AccessibleForwardIcon fontSize='large' /><Typography className={classes.typographyStyles}>notTwitter();</Typography></Grid>
					<Grid item xs={8}><GoogleAuth /></Grid>
				</Grid>
				
			</Toolbar>
		</AppBar>
	)
}

export default Header
