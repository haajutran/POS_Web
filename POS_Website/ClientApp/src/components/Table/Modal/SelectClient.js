import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../../../store/Modal/SelectClient";

import {
  Icon,
  Badge,
  Row,
  Col,
  Input,
  Button,
  Table,
  Form,
  Select,
  Modal,
  message
} from "antd";

const { Search } = Input;

class SelectClient extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  search = text => {
    if (text.length > 0) {
      const data = {
        ClientInfo: text
      };
      this.props.filterClients(data);
    }
    this.setState({
      selectedClient: undefined
    });
  };

  selectClient = record => {
    this.setState({
      selectedClient: record
    });
  };

  handleSelectClient = async () => {
    const { selectedClient } = this.state;
    if (selectedClient) {
      const data = {
        ClientCode: selectedClient.clientFolioNum,
        CheckNo: this.props.checkNo
      };
      const res = await this.props.selectClient(data);

      if (res.status === 200) {
        message.success("Selected Client");
        this.props.onCancel("success");
      }
    } else {
      message.warn("Please select client first.");
    }
  };

  render() {
    const { clients } = this.props;
    const { selectedClient } = this.state;
    console.log(clients);
    return (
      <div className="select-client-section">
        <div>
          <span>Client: </span>
          {selectedClient && <span>{selectedClient.sClientName}</span>}
        </div>
        <Table
          dataSource={clients}
          onRow={record => ({
            onClick: () => this.selectClient(record)
            // this.handleChangeQuantity(record)
          })}
          rowClassName={(record, index) =>
            selectedClient
              ? record.clientFolioNum === selectedClient.clientFolioNum
                ? "selected-row"
                : ""
              : ""
          }
          columns={columns}
          scroll={{ y: 300 }}
          pagination={{ position: "top" }}
        />
        <div className="function-zone">
          <Search
            placeholder="Client Information"
            onSearch={value => this.search(value)}
            enterButton
          />
          <Button
            className="select-button"
            icon="select"
            type="primary"
            onClick={() => this.handleSelectClient()}
          >
            Select
          </Button>
        </div>
      </div>
    );
  }
}

const columns = [
  {
    title: "Code",
    dataIndex: "clientFolioNum",
    key: "clientFolioNum"
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title"
  },
  {
    title: "Client Name",
    dataIndex: "sClientName",
    key: "sClientName"
  },
  {
    title: "Phone Number",
    dataIndex: "sClientName",
    key: "sClientName"
  },
  {
    title: "Address",
    dataIndex: "clientAdress",
    key: "clientAdress"
  }
];

export default connect(
  state => state.selectClient,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(SelectClient);
