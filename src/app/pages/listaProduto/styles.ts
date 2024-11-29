import { StyleSheet } from "react-native";
import { colors } from "../../style/colors";

export const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.verde[400],
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 5,
        borderColor: colors.cinza[100],
    },
    textIncitial: {
        color: '#fff',
        fontSize: 11,
        textAlign: "left",
        // marginBottom: 20,
        // paddingHorizontal: 10,
        width:340,
        paddingLeft:10,
        position:"absolute",

        top:10,
        left:1,

    },
    productContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    productBox: {
        width: '45%',
        backgroundColor: "transparent",
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
    },
    productImage: {
        width: 60,
        height: 60,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    productName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    productDescription: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
    },
    triangle: {
        top: 0,
        right: 0,
        height: 0,
        borderLeftWidth: 120,
        borderBottomWidth: 80,
        borderLeftColor: 'transparent',
        borderBottomColor: colors.verde[400],
    },
    triangle1: {

        borderLeftWidth: 340,
        borderBottomWidth: 5,
        borderLeftColor: 'transparent',
        borderBottomColor: colors.cinza[100],
    },
    triangle2: {
        top:61,
        right:-45,
        borderLeftWidth: 190,
        borderBottomWidth: 11,
        // borderRightWidth: 10,
        borderLeftColor: 'transparent',
        borderBottomColor: colors.cinza[100],
        position:"absolute",
        transform: [{ rotate: "148deg" }]
    },
});
