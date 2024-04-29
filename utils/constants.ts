const CONSTANTS: Record<string, any> = {
    ROLE_OWNER: 'owner',
};

export default function (key: string) {
    return CONSTANTS[key];
}
