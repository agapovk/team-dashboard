// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@ui/components/ui/table';
// import React from 'react';

// type Props = {
//   data: object[];
// };

// export default function SimpleTable(props: Props) {
//   console.log(props.data);
//   return (
//     <Table className="text-xs">
//       <TableHeader>
//         <TableRow>
//           {Object.keys(props.data[0]).map((h) => (
//             <TableHead>{h}</TableHead>
//           ))}
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {props.data.map((d) => (
//           <TableRow>
//             {Object.values(d).map((r) => {
//               if (r === null) {
//                 return <TableCell>Нет данных</TableCell>;
//               } else if (typeof r === 'object') {
//                 return <TableCell>{JSON.stringify(r, null, 2)}</TableCell>;
//               } else {
//                 return <TableCell>{r}</TableCell>;
//               }
//             })}
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }
