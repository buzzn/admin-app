// @flow
import * as React from 'react';
import ReactTable from 'react-table';
import { tableParts as TableParts } from 'react_table_config';
import FormulaDataForm from '../formula_data';

type Props = {
  formulas: Array<Object>,
  registers: Array<Object>,
  updateFormula: Function,
};

const Formulas = ({ formulas, registers, updateFormula }: Props) => {
  const columns = [
    {
      Header: () => <TableParts.components.headerCell title="Operation"/>,
      accessor: 'operator',
      minWidth: 200,
      Cell: ({ value }) => (
        <span className="fa-stack fa-sm">
          <i className={ `fa fa-${value === '+' ? 'plus' : 'minus'} fa-stack-1x` }/>
          <i className="fa fa-circle-o fa-stack-2x"/>
        </span>
      ),
    },
    {
      Header: () => <TableParts.components.headerCell title="Name"/>,
      accessor: 'register.name',
      minWidth: 200,
    },
    {
      Header: () => <TableParts.components.headerCell title="Direction"/>,
      accessor: 'register.direction',
      minWidth: 200,
    },
  ];

  return [
    <p key={ 1 } className="h4">Formulas:</p>,
    <div key={ 2 } className="p-0">
      <ReactTable {...{
        data: formulas,
        columns,
        SubComponent: ({ original }) => {
          const initialValues = {
            operator: original.operator,
            registerId: original.register.id,
          };
          return (
            <FormulaDataForm {...{
              updateFormula,
              registers,
              form: `formulaUpdateForm_${original.id}`,
              formula: original,
              initialValues,
            }}/>
          );
        },
      }} />
    </div>,
  ];
};

export default Formulas;
