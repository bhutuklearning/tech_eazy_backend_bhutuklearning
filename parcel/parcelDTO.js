export class ParcelDTO {
    constructor({ customerName, deliveryAddress, trackingNumber }) {
        this.customerName = customerName;
        this.deliveryAddress = deliveryAddress;
        this.trackingNumber = trackingNumber;
    }
}