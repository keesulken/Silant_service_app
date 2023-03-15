import React from 'react'

export default function UnauthMachine(props) {
  if (props.machine) {
    let mach = props.machine;
    return (
        <div>
            <p>Search results</p>
            <p>info about your machine</p>
            <table>
                <thead>
                    <tr>
                        <th>factory num</th>
                        <th>model</th>
                        <th>engine</th>
                        <th>engine num</th>
                        <th>transmission</th>
                        <th>transmission num</th>
                        <th>drive axle</th>
                        <th>drive axle num</th>
                        <th>steered axle</th>
                        <th>steered axle num</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{ mach.factory_number }</td>
                        <td>{ mach.machine_model }</td>
                        <td>{ mach.engine_model }</td>
                        <td>{ mach.engine_number }</td>
                        <td>{ mach.transmission_model }</td>
                        <td>{ mach.transmission_number }</td>
                        <td>{ mach.drive_axle_model }</td>
                        <td>{ mach.drive_axle_number }</td>
                        <td>{ mach.steered_axle_model }</td>
                        <td>{ mach.steered_axle_number }</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
  } else {
    return null;
  }
}
