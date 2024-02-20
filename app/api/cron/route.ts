import Product from "@/lib/models/Product"
import { connectToDB } from "@/lib/mongoose"
import { generateEmailBody, sendEmail } from "@/lib/nodemiller";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";

export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
    try {
        connectToDB()
        const products = await Product.find({});

        if(!products) throw new Error("No products found")

        //1 scrpe latest products details and update DB

        const updatedProducts = await Promise.all(
            products.map(async (currentProduct)=>{
                const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

                if(!scrapedProduct) throw new Error("no product found")
                const updatedPriceHistory = [
                    ...currentProduct.priceHistory,
                    {price:scrapedProduct.currentPrice}
                ]

                const product = {
                    ...scrapedProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory),
                  }

                  const updatedProduct = await Product.findOneAndUpdate(
                    {url:product.url},
                    product ,
                )

                // 2 check each product status 

                const emailNotifyType = getEmailNotifType(scrapedProduct , currentProduct) 
                if(emailNotifyType && updatedProduct.users.length > 0){
                    const productInfo ={
                        title :updatedProduct.title,
                        url :updatedProduct.url,
                    }

                    const EmailContent =await generateEmailBody(productInfo , emailNotifyType);

                    const userEmails = updatedProduct.users.map((user:any)=>user.email);

                    await sendEmail(EmailContent , userEmails);
                }

                return updatedProduct

            })
        )

        return NextResponse.json({
            message:"Ok",data:updatedProducts
        })

    } catch (error) {
        console.log(error)
    }
}