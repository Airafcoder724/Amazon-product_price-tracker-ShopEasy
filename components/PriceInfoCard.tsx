import Image from "next/image"

interface props {
    title:string,
    iconsrc:string,
    value:string,
    bordercolor:string
}

const PriceInfoCard = ({title , iconsrc , value , bordercolor}:props) => {
  return (
    <div className={`price-info_card border-l-[${bordercolor}]`}>
        <p className="text-base text-black-100">
            {title}
        </p>

        <div className="flex gap-1">
            <Image src={iconsrc} alt={title} width={24} height={24}  />
            <p className="text-2xl font-bold text-secondary">{value}</p>
        </div>
    </div>
  )
}

export default PriceInfoCard