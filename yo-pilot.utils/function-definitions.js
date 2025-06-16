const wrapResponse = (response) => {
    return { functionResults: response };
}

const functionDefinitions = function (client) {
    return {
        loadPurchaseRequests: async ({status = ''}) => {
            let filter = `Requester eq '$$empId$$'`;      
            
            if (status.includes('open')) {
                filter += ` and DocumentStatus eq 'bost_Open'`;
            } else if (status.includes('close')) {
                filter += ` and DocumentStatus eq 'bost_Close'`;
            }
           
            return wrapResponse(await client.get(`/resource/PurchaseRequests?$filter=${filter}`));
        },
        loadPurchaseRequestsCount: async ({status = ''}) => {     
             
            let filter = `Requester eq '$$empId$$'`;
             
            if (status.includes('open')) {
                filter += ` and DocumentStatus eq 'bost_Open'`;
            } else if (status.includes('close')) {
                filter += ` and DocumentStatus eq 'bost_Close'`;
            }
        
            return wrapResponse(await client.get(`/resource/PurchaseRequests/$count?$filter=${filter}`));
        },
        
        loadPurchaseRequestslatest: async () => {
            return wrapResponse(await client.get(`/resource/PurchaseRequests?$filter=Requester eq '$$empId$$' &$orderby=DocDate desc&$top=1`));
        },
        createPurchaseRequest: async ({RequriedDate, DocumentStatus, ItemCode, ItemDescription, LineVendor, Price, Currency, Quantity, RequiredDateItem, WarehouseCode}) => {
            return wrapResponse(await client.post('/resource/PurchaseRequests', 	
                {                
                RequriedDate: RequriedDate,
                DocumentStatus: DocumentStatus,
                RequesterName: "manager",
                DocumentsOwner: "$$empId$$",
                DocumentLines: [
                    {
                        ItemCode: ItemCode,
                        ItemDescription: ItemDescription,
                        LineVendor: LineVendor,
                        Price: Price,
                        Currency: Currency,
                        Quantity: Quantity,
                        RequiredDateItem: RequiredDateItem,
                        WarehouseCode: WarehouseCode
                    }
                ]
            }));
        }
    }

}

export default functionDefinitions;