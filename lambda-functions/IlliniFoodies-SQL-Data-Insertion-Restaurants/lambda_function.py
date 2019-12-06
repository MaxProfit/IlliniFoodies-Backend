from requests import get
import pandas as pd
import json
import os


API_KEY = os.environ['ApiKey']

def mapPrice(row):
    if row["price"] == "$":
        return [0, 10]
    elif row["price"] == "$$":
        return [11, 30]
    elif row["price"] == "$$$":
        return [31, 60]
    else:
        return [61, 100]
        

def parseCategories(categories):
    tags = ""
    for obj in categories:
        tags += obj["alias"] + ","
    return tags[:len(tags) - 1]

def lambda_handler(event, context):
    COLUMNS = ["id", "name", "phone", "address", "image_url", "avgPrice", "rating", "url", "keywords"]
    restaurants = []
    for offset in range(0, 501, 50):
        response = get("https://api.yelp.com/v3/businesses/search",
                    headers={"Authorization": "Bearer " + API_KEY},
                    params={"location": "Urbana-Champaign", "limit": 50, "offset": offset})
    
        if response:
            df = pd.DataFrame.from_dict(response.json()["businesses"], orient="columns")
        
            # clean up some of the data formats
            df["address"] = df["location"].apply(lambda x: x["address1"])
            df[["priceMin", "priceMax"]] = df.apply(mapPrice, axis=1, result_type="expand")
            df["avgPrice"] = df.apply(lambda x: (x["priceMin"] + x["priceMax"]) / 2, axis=1)
    
            # parse categories into an array of tags
            df["keywords"] = df["categories"].apply(parseCategories)
    
            # get only the columns we need
            df = df[COLUMNS]
            
            restaurants.append(df)
        
    df = pd.concat(restaurants)
    
    # raise ValueError('A very specific bad thing happened.')
    return json.dumps(df.to_dict(orient="records"))
    # return True
