import Card from "@/components/Card";
import Modal from "@/components/Modal";
import PriceInfoCard from "@/components/PriceInfoCard";
import { getProductByID, getSimilarProducts } from "@/lib/actions"
import { formatNumber } from "@/lib/utils";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
    params: { id: string }
}

const ProductDetails = async ({ params: { id } }: Props) => {
    const product: Product = await getProductByID(id);
    const similarProduct  = await getSimilarProducts(id);
    if (!product) redirect("/");
    const desc = product?.description?.split('\n')


    return (
        <div className="product-container">
            <div className="flex gap-28 xl:flex-row flex-col">
                <div className="product-image">
                    <Image src={product.image} alt={product.title} width={580} height={400} className="mx-auto" />
                </div>

                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
                        <div className="flex flex-col gap-3">
                            <p className="text-[28px] text-secondary text-semibold">{product.title}</p>
                            <Link
                                href={product.url}
                                target="_blank"
                                className="text-base text-black opacity-50"
                            >
                                Visit Product on Amazon

                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="product-hearts">
                                <Image src="/assets/icons/red-heart.svg"
                                    alt="heart"
                                    width={20}
                                    height={20} />
                                <p className="text-base font-semibold text-[#D46F77]">
                                    {product.reviewsCount}
                                </p>
                            </div>

                            <div className="p-2 bg-white-200 rounded-10">
                                <Image src="/assets/icons/bookmark.svg" alt="bookmark" width={20} height={20} />
                            </div>

                            <div className="p-2 bg-white-200 rounded-10">
                                <Image src="/assets/icons/share.svg" alt="share" width={20} height={20} />
                            </div>
                        </div>
                    </div>

                    <div className="product-info">
                        <div className="flex flex-col gap-2">
                            <p className="text-[34px] text-secondary font-bold">
                                {product.currency}{formatNumber(product.currentPrice)}
                            </p>
                            <p className="text-[21px] text-secondary line-through opacity-50">
                                {product.currency}{formatNumber(product.originalPrice)}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex gap-3">
                                <div className="product-stars">
                                    <Image src="/assets/icons/star.svg" alt="star" width={16} height={16} />
                                    <p className="text-sm text-primary-orange font-semibold ">{product.stars || '4.0'}</p>
                                </div>

                                <div className="product-reviews">
                                    <Image src="/assets/icons/comment.svg" alt="comment_svg" width={16} height={16} />
                                    <p className="text-sm text-secondary font-semibold">{product.reviewsCount}</p>
                                </div>
                            </div>

                            <p className="text-sm text-black opacity-50">
                                <span className="text-primary-green font-semibold">93%</span>
                                of buyers have recommeded this
                            </p>
                        </div>
                    </div>

                    <div className="my-7 flex flex-col gap-5">
                        <div className="flex gap-5 flex-wrap">
                            <PriceInfoCard
                                title="Current Price"
                                iconsrc="/assets/icons/price-tag.svg"
                                value={`${product.currency} ${formatNumber(product.currentPrice)}`}
                                bordercolor='#bEffc5'
                            />

                            <PriceInfoCard
                                title="Average Price"
                                iconsrc="/assets/icons/chart.svg"
                                value={`${product.currency} ${formatNumber(product.averagePrice)}`}
                                bordercolor='#b6dbff'
                            />

                            <PriceInfoCard
                                title="Highest Price"
                                iconsrc="/assets/icons/arrow-up.svg"
                                value={`${product.currency} ${formatNumber(product.highestPrice)}`}
                                bordercolor='#b6dbff'
                            />

                            <PriceInfoCard
                                title="Lowest Price"
                                iconsrc="/assets/icons/arrow-down.svg"
                                value={`${product.currency} ${formatNumber(product.lowestPrice)}`}
                                bordercolor='#b6dbff'
                            />
                        </div>
                    </div>

                    <Modal productId={id}/>
                </div>
            </div>

            <div className="flex flex-col gap-16 ">
                <div className="flex flex-col gap-5">
                    <h3 className="text-2xl text-secondary font-semibold">
                        Product Discription
                    </h3>

                    <div className="flex flex-col gap-4">
                        {desc}
                    </div>
                </div>

                <button className="btn w-[200px] mx-auto flex items-center justify-center gap-3 min-w-200px">
                    <Image src="/assets/icons/bag.svg"
                    alt="bag"
                    width={22}
                    height={22}
                    />
                    <Link href="/" className="text-base text-white">Buy Now</Link>
                </button>
            </div>

            <div>
                <h2 className="text-2xl  font-semibold ">
                    Similar Products
                </h2>

                <div className="flex flex-row mt-7 w-full flex-wrap gap-5 ">
                    {similarProduct?.map((similar)=>(
                        <Card key={similar._id} product={similar} />
                    ))}

                </div>
            </div>
        </div>
    )
}

export default ProductDetails