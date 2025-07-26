// DeliveryOrderDTO.js
// DTO for DeliveryOrder API responses

// If there was previous code, it would be commented out here.

export class DeliveryOrderDTO {
  constructor({ vendorName, date, totalOrders, fileLink }) {
    this.vendorName = vendorName;
    this.date = date;
    this.totalOrders = totalOrders;
    this.fileLink = fileLink;
  }
}

export default DeliveryOrderDTO;