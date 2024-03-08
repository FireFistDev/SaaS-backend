export interface SubscriptionTier {
    maxFile: number;
    price: number;
    maxUsers : number
}

export enum SubscriptionsEnum {
    FreeTier = 'FreeTier',
    BasicTier = 'BasicTier',
    PremiumTier = 'PremiumTier'
}


export const SubscriptionPlans: Record<SubscriptionsEnum, SubscriptionTier> = {
    [SubscriptionsEnum.FreeTier]: {
        maxFile: 10,
        price: 0,
        maxUsers : 1
    },
    [SubscriptionsEnum.BasicTier]: {
        maxFile: 100,
        price: 5,
        maxUsers : 10
    },
    [SubscriptionsEnum.PremiumTier]: {
        maxFile: 1000,
        price: 300,
        maxUsers : -1,
    },
};
