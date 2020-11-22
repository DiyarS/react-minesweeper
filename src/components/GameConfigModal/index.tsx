import React, { useState, useEffect } from "react";
import { Modal, Form, Select } from "antd";
import { IGameConfig } from "../../interfaces";
import { uuid } from "../../utils";
import { FormWrapper } from "./styles";

const ROWS_COLUMNS_COUNTS = [10, 20, 30, 40];
const MINES_COUNTS = [30, 60, 90];

interface IProps {
  onSubmit: (values: IGameConfig) => void;
}

const formFieldValidation = [{ required: true, message: "Required" }];

const GameConfigModal: React.FC<IProps> = ({ onSubmit }) => {
  const [showModalOnStart, setShowModalOnStart] = useState(false);

  const [rowsCount, setRowsCount] = useState(0);
  const [columnsCount, setColumnsCount] = useState(0);
  const [minesCount, setMinesCount] = useState(0);

  useEffect(() => {
    setShowModalOnStart(true);
  }, []);

  function renderOptions(optionsArr: Array<number>) {
    return (
      <>
        {optionsArr.map((value: number) => (
          <Select.Option key={uuid()} value={value}>
            {value}
          </Select.Option>
        ))}
      </>
    );
  }

  function onFormValuesChange(values: IGameConfig) {
    const { rowsCount, columnsCount, minesCount } = values;

    rowsCount && setRowsCount(rowsCount);
    columnsCount && setColumnsCount(columnsCount);
    minesCount && setMinesCount(minesCount);
  }

  function onSubmitSettings() {
    onSubmit({ rowsCount, columnsCount, minesCount });
    setShowModalOnStart(false);
  }

  return (
    <Modal
      visible={showModalOnStart}
      onOk={onSubmitSettings}
      onCancel={() => setShowModalOnStart(false)}
    >
      <FormWrapper>
        <Form onValuesChange={onFormValuesChange}>
          <Form.Item
            label="Please specify number of rows"
            name="rowsCount"
            rules={formFieldValidation}
          >
            <Select>{renderOptions(ROWS_COLUMNS_COUNTS)}</Select>
          </Form.Item>
          <Form.Item
            label="Please specify number of columns"
            name="columnsCount"
            rules={formFieldValidation}
          >
            <Select>{renderOptions(ROWS_COLUMNS_COUNTS)}</Select>
          </Form.Item>
          <Form.Item
            label="Please specify number of mines"
            name="minesCount"
            rules={formFieldValidation}
          >
            <Select>{renderOptions(MINES_COUNTS)}</Select>
          </Form.Item>
        </Form>
      </FormWrapper>
    </Modal>
  );
};

export default GameConfigModal;
