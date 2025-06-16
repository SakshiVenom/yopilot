const functionDeclarations = function (z) {
  return [
    {
      name: "loadPurchaseRequests",
      description: `returns the json of the various Purchase Requests. The Purchase Requests are included in the 'results' property. An optional status filter ('open' or 'close') can be applied to retrieve only the Purchase Requests matching the specified status. If DocNum or DocNum value is present in the response, it should always appear as a clickable blue link(a tag) with href '/#/PurchaseRequests/{DocEntry}', where 'DocEntry' is the corresponding variable value. Make DocNum a link always. Also set inside link, set target="_self" for all.`,
      schema: z.object({
        status: z.string().optional().describe("Optional. Can be 'open' or 'close' to filter Purchase Requests based on status.")
      }).describe("Filters Purchase Requests by status if provided (open/close).")
    },
    {
      name: "loadPurchaseRequestsCount",
      description: `Returns the total count of Purchase Requests. If a status ('open' or 'close') is specified, the count will be filtered accordingly. If no status is provided, the total count of all Purchase Requests is returned.`,
      schema: z.object({
        status: z.string().optional().describe("Optional. Can be 'open' or 'close' to filter the count of Purchase Requests based on status.")
      }).describe("Filters the count of Purchase Requests by status if provided (open/close).")
    },
    {
      name: "loadPurchaseRequestslatest",
      description: `the most recent Purchase Request of the logged-in user by sorting in descending order of DueDate. Don't show by whom it was created by because by default, we are only showing the logged in user's latest Purchase request only. If DocNum or DocNum value is present in the response, it should always appear as a clickable blue link(a tag) with href '/#/PurchaseRequests/{DocEntry}', where 'DocEntry' is the corresponding variable value. Make DocNum a link always. Also set inside link, set target="_self" for all.`
    },
    {
      name: "createPurchaseRequest",
      description: `ask for various details from user to create the Purchase request.
					1. Ask required date, then give a calendar control to save the date from user.
					2. Ask for the Items they want to add along with their price with currency and also quantity and if there is any required date for that item. give controls accordingly.
					3. also ask for the supplier of those items along with the items only.
					Then arrange all the details in a payload.
					Example: {    
              "RequriedDate": "2024-10-18T14:36:59.758Z",
              "DocumentStatus": "bost_Open",
              "DocDate": "2024-10-18T14:36:59.758Z",
              "Requester": $$empId$$,
              "DocumentsOwner": $$empId$$,
              "DocumentLines": [
                  {
                      "ItemCode": "000010",
                      "ItemDescription": "Manutenzione Licenze SAP",
                      "LineVendor": "F00003",
                      "Price": 200,
                      "Currency": "EUR",
                      "Quantity": 1,
                      "RequiredDateItem": "2024-11-01T00:00:00.000Z",
                      "WarehouseCode": "Mc"
                  }
              ]
          } .
          DocumentStatus will always be bost_Open for new document, DocDate will be current date, RequiredDate will be updated by user, Requester and DocumentsOwner don't ask them from user. Don't ask for the employee Id.
          In DocumentLines, we will store items for the purchase request.LineVendor is the Supplier Code. All the details of this will be from user, just WarehouseCode will always be "Mc". Send this and on suuccessfully post, say it is created along with the details.`,
          schema: z.object({
            RequriedDate: z.string().describe("Required Date of the Purchase Request"),
            DocumentStatus: z.string().describe("Always bost_Open for new Purchase Request"),
            DocDate: z.string().describe("always current date"),
            Requester: z.string().describe("always send $$empId$$"),
            DocumentsOwner: z.string().describe("always send $$empId$$"),
            ItemCode: z.string().describe("Itemcode user gives"),
            ItemDescription: z.string().describe("Item description given by user"),
            LineVendor: z.string().describe("Supplier code or Vendor code given by user"),
            Price: z.string().describe("Price given by user for that item"),
            Currency: z.string().describe("Currency given by user for that item"),
            Quantity: z.string().describe("Quantity given by user for that item"),
            RequriedDateItem: z.string().describe("Required Date given by user for that item"),
            WarehouseCode: z.string().describe("Warehouse Code will always be Mc")
          }).describe("Create the Purchase Request")
    
        }
  ].reduce((oFnDec, item) => { oFnDec[item.name] = item; return oFnDec }, {});
};

export default functionDeclarations;