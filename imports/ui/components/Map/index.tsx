import React from 'react';
import { range, map } from 'ramda';
import './styles.css';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const Map: React.SFC<{
  lines: number;
  cols: number;
}> = ({
  cols,
  lines,
}) => {
  return (
    <table className="map-table-container">
      <thead>
        <tr><th />{map((nbCol: number) => <th key={nbCol}>{alphabet.charAt(nbCol)}</th>)(range(0, cols))}</tr>
      </thead>
      <tbody>
        { map((nbLine: number) =>
          <tr key={nbLine}>
            <th>{ nbLine }</th>
            {map((nbCol: number) => (
              <td key={nbCol}>{alphabet.charAt(nbCol)} - {nbLine}</td>
            ))(range(0, cols))
          }</tr>
        )(range(1, lines))}
      </tbody>
    </table>
  );
}

export default Map;
