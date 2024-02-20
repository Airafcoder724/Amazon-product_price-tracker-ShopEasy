import axios from "axios";
import * as cheerio from 'cheerio'
import { extractCurrency, extractDescription, extractPrice, extractReviews } from "../utils";
export async function  scrapeAmazonProduct(url:string) {
    if(!url)return;

    // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_a689747c-zone-shoeasy:srdoc672x7ua -k https://lumtest.com/myip.json
    // BrightData proxy configuration

    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);

    const port = 22225;

    const session_id = (100000* Math.random()) | 0;

    const options ={
        auth:{
            username:`${username}-session-${session_id}`,
            password,
        },
        host:'brd.superproxy.io',
        port,
        rejectUnauthorized :false,
    }

    try {
        // fetch the product page
        const response = await axios.get(url , options);
        const $ = cheerio.load(response.data);

        const title = $('#productTitle').text().trim();

        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a.size.base.a-color.price'),
            $('.a-button-selected .a-color-base'),
            $('.a-colo-price')
        );

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        )
        
        const outofStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';
        const images = $('#imgBlkFront').attr('data-a-dynamic-image') || $('#landingImage').attr('data-a-dynamic-image') || '{}'

        const categoryImage = $('.nav-categ-image').attr('src') || '{}' ;

        const reviewsCount = extractReviews(
            $('#acrCustomerReviewText'),
            )
            const starRatingSelector = 'i.a-icon-star span.a-icon-alt, span.a-icon-alt';
            const starRatingText = $(starRatingSelector).first().text();
            const starRating = starRatingText.match(/([0-9.]+) out of 5 stars/)
            
            
            
            const imageUrl = Object.keys(JSON.parse(images))
            // const categoryImageUrl = Object.keys(JSON.parse(categoryImage))
            // console.log(categoryImageUrl)

        const currency = extractCurrency($('.a-price-symbol'));
        
        const discount = $('.savingsPercentage').text().replace(/[-%]/g,"");

        const description = extractDescription($)

        // construct data object from scrape information
        const data = {
            url:url,
            currency:currency||'₹',
            image:imageUrl[0],
            title,
            description,
            currentPrice : Number(currentPrice) || Number(originalPrice),
            originalPrice : Number(originalPrice) ||  Number(currentPrice),
            priceHistory:[],
            discount:Number(discount),
            category:categoryImage,
            reviewsCount,
            isOutOfStock:outofStock,
            stars:starRating?.input || "4.0",
            lowestPrice : Number(currentPrice) ||  Number(originalPrice),
            highestPrice :  Number(originalPrice) || Number(currentPrice),
            averagePrice :  Number(currentPrice) ||  Number(originalPrice)

        }
        return data;
    } catch (error:any) {
        throw new Error(`failed to scrape2 product:${error.message}`)
    }
}