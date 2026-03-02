function detailsToHtml(details = []) {
  return `
    <table style="width:100%;border-collapse:collapse">
      ${details.map(d => `
        <tr>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;color:#555">
            ${d.label}
          </td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">
            <b>${d.value}</b>
          </td>
        </tr>
      `).join("")}
    </table>
  `;
}

export { detailsToHtml };