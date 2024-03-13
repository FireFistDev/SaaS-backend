import { SubscriptionEnum } from "@prisma/client";

export interface SubscriptionTier {
    TierName: SubscriptionEnum
    maxFile: number;
    price: number;
    maxUsers : number
}

export const SubscriptionPlans: Record<SubscriptionEnum, SubscriptionTier> = {
    [SubscriptionEnum.FreeTier]: {
        TierName: 'FreeTier',
        maxFile: 10,
        price: 0,
        maxUsers : 1
    },
    [SubscriptionEnum.BasicTier]: {
        TierName: 'BasicTier',
        maxFile: 100,
        price: 5,
        maxUsers : 10
    },
    [SubscriptionEnum.PremiumTier]: {
        TierName: 'PremiumTier',
        maxFile: 1000,
        price: 300,
        maxUsers : Infinity ,
    },
};
