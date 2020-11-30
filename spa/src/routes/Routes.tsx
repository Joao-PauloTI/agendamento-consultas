import React from "react";
import { Switch, Route } from "react-router-dom";

import PaginaPrincipal from '../pages/PaginaPrincipal'

function Routes() {
	return (
		<Switch>
			<Route path="/" exact component={PaginaPrincipal} />
		</Switch>
	);
}

export default Routes;
