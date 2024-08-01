export const keyToHumanValue = (key: string) => {
    let transformedKey: string = '';
    switch (key) {
        case 'dateOfBirth':
            transformedKey = 'Date of Birth';
            break;
        case 'schoolCurrentlyAttending':
            transformedKey = 'School Currently Attending';
            break;
        case 'schoolWishToAttend':
            transformedKey = 'School Wishing To Attend';
            break;
        case 'gradeAndYearDoing':
            transformedKey = 'Grade and Year';
            break;
        case 'hasGrant':
            transformedKey = 'Has Study Grant';
            break;
        case 'grantDetails':
            transformedKey = 'Additional Grant Comments';
            break;
        case 'course':
            transformedKey = 'Course Wishing To Study After Matric';
            break;
        case 'fetWishToAttend':
            transformedKey = 'College or University';
            break;
        case 'requestingFor':
            transformedKey = 'Requesting';
            break;
        case 'motivation':
            transformedKey = 'Motivation';
            break;
        case 'cellOne':
            transformedKey = 'Cell One';
            break;
        case 'cellTwo':
            transformedKey = 'Cell Two';
            break;
        case 'email':
            transformedKey = 'Email';
            break;
        case 'town':
            transformedKey = 'Town';
            break;
        case 'city':
            transformedKey = 'City';
            break;
        case 'province':
            transformedKey = 'Province';
            break;
        case 'race':
            transformedKey = 'Race';
            break;
        case 'gender':
            transformedKey = 'Gender';
            break;
        case 'schoolName':
            transformedKey = 'school Name';
            break;
        case 'principalContactDetails':
            transformedKey = 'Principal Contact Details';
            break;
        case 'accountsContactDetails':
            transformedKey = 'Accounts Contact Details';
            break;
        default:
            return ''
    }
    return transformedKey;
}

export const getTransformedValue = (key: string, value: any) => {
    if (key == 'dateOfBirth') {
        return new Date(value).toLocaleDateString('en-GB')
    }
    return value
}

export const keysListToHuman = (...keys: string[]) => {
    return keys.map(key => keyToHumanValue(key))
}

export const setUpKeyValueList = (data: any, keysToMap: string[], value = '') => {
    const dateRegex = /date/i;
    const convertedKeys = keysListToHuman(...keysToMap);
    return convertedKeys.map((key, i) => {
        value = dateRegex.test(key) ? data[keysToMap[i]].toString().slice(4, 15) : data[keysToMap[i]]
        return { key, value }
    })
}