import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Templates.css";

import ReactTable from "react-table";
import "react-table/react-table.css";

import Cookie from "js-cookie";

import TemplateService from "../../../services/TemplateService";
import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

import MaterialIcon from "material-icons-react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

class Templates extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			isDialogOpen: false,
			name: ""
		};
	}

	getTemplateData = (self, template) => {
		return {
			_id: template._id,
			name: template.name,
			actions: (
				<div className="Actions">
					<div
						className="EditAction"
						onClick={() => {
							self.onTemplateEdit(template._id);
						}}
					>
						{Messages.LIST.BUTTONS.EDIT}
					</div>
					<div
						className="DeleteAction"
						onClick={() => {
							self.onTemplateDelete(template._id);
						}}
					>
						{Messages.LIST.BUTTONS.DELETE}
					</div>
				</div>
			)
		};
	};

	componentDidMount() {
		const token = Cookie.get("token");
		const self = this;

		self.setState({ loading: true });
		TemplateService.getAll(
			token,
			async function(templates) {
				templates = templates.map(template => {
					return self.getTemplateData(self, template);
				});
				self.setState({ templates: templates, loading: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	}

	onTemplateCreate = () => {
		const token = Cookie.get("token");
		const name = this.state.name;
		const self = this;
		self.setState({ loading: true });
		TemplateService.create(
			token,
			name,
			async function(template) {
				const templates = self.state.templates;
				templates.push(self.getTemplateData(self, template));
				self.setState({ isDialogOpen: false, templates: templates, loading: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	onTemplateDelete = id => {
		const token = Cookie.get("token");
		const self = this;
		self.setState({ loading: true });
		TemplateService.delete(
			token,
			id,
			async function(template) {
				const templates = self.state.templates.filter(t => t._id !== template._id);
				self.setState({ templates: templates, loading: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	onTemplateEdit = id => {
		this.props.history.push(Constants.ROUTES.EDIT_TEMPLATE + id);
	};

	onDialogOpen = () => this.setState({ isDialogOpen: true, name: "" });
	onDialogClose = () => this.setState({ isDialogOpen: false, name: "" });

	updateName = event => {
		this.setState({ name: event.target.value, error: "" });
	};

	moveToCertificates = () => {
		this.props.history.push(Constants.ROUTES.CERTIFICATES);
	};

	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}

		const loading = this.state.loading;
		const isDialogOpen = this.state.isDialogOpen;
		return (
			<div className="Templates">
				{this.renderSectionButtons()}
				{isDialogOpen && this.renderDialog()}
				{!loading && this.renderTable()}
				{this.renderButtons()}
				<div className="errMsg">{this.state.error && this.state.error.message}</div>
			</div>
		);
	}

	renderSectionButtons = () => {
		return (
			<div className="HeadButtons">
				<div className="SectionButtons">
					<button className="MoveButton" onClick={this.moveToCertificates}>
						{Messages.LIST.BUTTONS.TO_CERTIFICATES}
					</button>
					<button className="MoveButton" disabled>
						{Messages.LIST.BUTTONS.TO_TEMPLATES}
					</button>
				</div>
				<button className="CreateButton" onClick={this.onDialogOpen}>
					<MaterialIcon icon={Constants.TEMPLATES.ICONS.ADD_BUTTON} />
					<div className="CreateButtonText">{Messages.LIST.BUTTONS.CREATE_TEMPLATE}</div>
				</button>
			</div>
		);
	};

	renderDialog = () => {
		return (
			<Dialog open={this.state.isDialogOpen} onClose={this.onDialogClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="DialogTitle">{Messages.LIST.DIALOG.TITLE}</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label={Messages.LIST.DIALOG.NAME}
						type="text"
						onChange={this.updateName}
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.onTemplateCreate} disabled={!this.state.name} color="primary">
						{Messages.LIST.DIALOG.CREATE}
					</Button>
					<Button onClick={this.onDialogClose} color="primary">
						{Messages.LIST.DIALOG.CLOSE}
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	renderTable = () => {
		const templates = this.state.templates;
		const columns = [
			/*{
				Header: "Id",
				accessor: "_id"
			},*/
			{
				Header: Messages.LIST.TABLE.TEMPLATE,
				accessor: "name"
			},
			{
				Header: "",
				accessor: "actions"
			}
		];

		return (
			<div className="TemplateTable">
				<ReactTable
					previousText={Messages.LIST.TABLE.PREV}
					nextText={Messages.LIST.TABLE.NEXT}
					data={templates}
					columns={columns}
					defaultPageSize={Constants.TEMPLATES.TABLE.PAGE_SIZE}
					minRows={Constants.TEMPLATES.TABLE.MIN_ROWS}
				/>
			</div>
		);
	};

	renderButtons = () => {
		return (
			<button className="LogoutButton" onClick={this.onLogout}>
				{Messages.LIST.BUTTONS.EXIT}
			</button>
		);
	};
}

export default withRouter(Templates);
