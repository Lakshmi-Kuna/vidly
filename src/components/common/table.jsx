import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
const Table = ({ columns, sortColumn, onSort, data }) => {
  return (
    <table className="table">
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
      <TableBody data={data} columns={columns} />
      {/* <tbody>
      {movies.map((item) => (
        <tr key={item._id}>
          <td>{item.title}</td>
          <td>{item.genre.name}</td>
          <td>{item.numberInStock}</td>
          <td>{item.dailyRentalRate}</td>
          <td>
            <Like liked={item.liked} onClick={() => onLike(item)} />
          </td>
          <td></td>
        </tr>
      ))}
    </tbody> */}
    </table>
  );
};

export default Table;
