// CarShareButton.jsx
import React, { useEffect, useState } from "react";
import {
    FaShare,
    FaCopy,
    FaWhatsapp,
    FaFacebook,
    FaTwitter,
} from "react-icons/fa";
import toast from "react-hot-toast";

const CarShareButton = ({ carPackage, travelDate, className = "" }) => {
    const [showShareOptions, setShowShareOptions] = useState(false);

    const baseUrl = window.location.origin + window.location.pathname;

    // Prepare shareable data
    // const shareData = {
    //     packageId: carPackage?.packageId,
    //     title: carPackage?.title,
    //     destination: carPackage?.destination?.name,
    //     state: carPackage?.destination?.state,
    //     durationDays: carPackage?.durationDays,
    //     pickupLocation: carPackage?.pickupLocation,
    //     dropLocation: carPackage?.dropLocation,
    //     description: carPackage?.description,
    //     cars: carPackage?.carDetails?.map((car) => ({
    //         carId: car.carId,
    //         carName: car.carName,
    //         capacity: car.capacity,
    //         acAvailable: car.acAvailable,
    //         carType: car.carType,
    //         prices: car.carPrices,
    //     })),
    // };
    const shareData={
        carPackage,
        travelDate
    }


    useEffect(() => {
        console.log(shareData)
        console.log(carPackage)
    }, [shareData])


    // Encode in base64
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const shareUrl = `${baseUrl}?carPackage=${encoded}`;
    const shareText = `🚗 Check out this amazing package: ${carPackage?.title} - ${carPackage?.destination?.name}, ${carPackage?.destination?.state}`;

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: carPackage?.title,
                    text: shareText,
                    url: shareUrl,
                });
                setShowShareOptions(false);
            } catch (error) {
                handleCopyLink();
            }
        } else {
            handleCopyLink();
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied to clipboard!", {
                style: { borderRadius: "10px", background: "#333", color: "#fff" },
            });
            setShowShareOptions(false);
        } catch (error) {
            toast.error("Failed to copy link", {
                style: { borderRadius: "10px", background: "#333", color: "#fff" },
            });
        }
    };

    const handleWhatsAppShare = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
            `${shareText}\n\n${shareUrl}`
        )}`;
        window.open(whatsappUrl, "_blank");
        setShowShareOptions(false);
    };

    const handleFacebookShare = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
        )}`;
        window.open(facebookUrl, "_blank");
        setShowShareOptions(false);
    };

    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText
        )}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, "_blank");
        setShowShareOptions(false);
    };

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
                <FaShare className="text-sm" />
                <span className="text-sm font-medium">Share Package</span>
            </button>

            {showShareOptions && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowShareOptions(false)}
                    />

                    {/* Share Options */}
                    <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-[200px]">
                        <div className="space-y-2">
                            <button
                                onClick={handleNativeShare}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                            >
                                <FaShare className="text-blue-600" />
                                <span className="text-sm text-black">Share via...</span>
                            </button>

                            <button
                                onClick={handleCopyLink}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                            >
                                <FaCopy className="text-green-600" />
                                <span className="text-sm text-black">Copy Link</span>
                            </button>

                            <hr className="my-2" />

                            <button
                                onClick={handleWhatsAppShare}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                            >
                                <FaWhatsapp className="text-green-500" />
                                <span className="text-sm text-black">WhatsApp</span>
                            </button>

                            <button
                                onClick={handleFacebookShare}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                            >
                                <FaFacebook className="text-blue-600" />
                                <span className="text-sm text-black">Facebook</span>
                            </button>

                            <button
                                onClick={handleTwitterShare}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                            >
                                <FaTwitter className="text-blue-400" />
                                <span className="text-sm text-black">Twitter</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CarShareButton;
