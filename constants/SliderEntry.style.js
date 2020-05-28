import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './Colors'
import _ from 'underscore'

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const windowHeight = viewportHeight;
export const windowWidth = viewportWidth;
export const sliderWidth = viewportWidth;
export const attachmentSize = (sliderWidth - 20*2 - 33*2)/3
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

// windowHeight
// iphone 8 - 375x667
// iphone 11 pro  - 375x812, 2436×1125
// iphone 11 pro max - 414x896, 2688×1242
// 190 ~ 210 사이의 크기로 정리됨 

export const device = {
    small : {
        // iphone5
        window: {
            width: 320
        },
        pixel: {
            width: 640,
            height: 1136
        },
        scale : 0.3827
    },
    medium: {
        // iphone8
        window: {
            width: 375,
            height: 667
        },
        pixel: {
            width: 750,
            height: 1334
        },
        scale : 0.3827
    },
    large : {
        // iphone 11
        window: {
            width: 375,
            height: 812
        },
        pixel: {
            width: 828,
            height: 1792
        },
        scale : 0.422
    },
    xlarge: {
        // iphone 11 max
        window: {
            width: 414,
            height: 896
        },
        pixel: {
            width: 1242,
            height: 2688
        },
        scale : 0.422
    }
}

export const isDeviceSize = (size) => {
    if ( _.isEmpty(device[size])) return false
    return windowWidth <= device[size].window.width
}

export const scaleFactor = () => {
    for( var spec of Object.values(device)) {
        if (windowHeight <= spec.window.height) return spec.scale
    }
    return 0.422    // default value
}

const entryBorderRadius = 8;

export default StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: colors.black,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    imageContainerEven: {
        backgroundColor: colors.black
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor: colors.black
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    textContainerEven: {
        backgroundColor: colors.black
    },
    title: {
        color: colors.black,
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: colors.gray,
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    }
});