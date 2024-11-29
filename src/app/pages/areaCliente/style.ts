import { colors } from "../../style/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: colors.verde[500],
        borderBottomWidth: 3,
        borderTopWidth:3,
        borderColor: colors.cinza[100],
    },
    boxTextExplication: {
        height: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    textExplication: {
        color: colors.cinza[100],
        fontWeight: "500",
        fontSize: 13
    },
    orderButton: {
        backgroundColor: '#2B4C2F',
        borderWidth: 1,
        borderColor: colors.cinza[100],
        borderRadius: 2,
        paddingVertical: 10,
        paddingHorizontal: 5,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 35,
        width: 170
    },
    orderButtonText: {
        color: colors.cinza[100],
        fontSize: 16,
        fontWeight: 'bold',
    },
    aboutSection: {
        backgroundColor: colors.cinza[100],
        padding: 10,
        marginBottom: 20,
        borderRadius: 2
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2B4C2F',
        marginBottom: 10,
    },
    sectionText: {
        fontSize: 14,
        color: '#2B4C2F',
        textAlign: 'justify',
    },
    historySection: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius:2,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2B4C2F',
        marginBottom: 10,
    },
    historyTable: {
        borderTopWidth: 1,
        borderColor: '#2B4C2F',
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        backgroundColor: '#F0F0F0',
        
    },
    tableHeaderText: {
        fontWeight: 'bold',
        color: '#2B4C2F',
        textAlign: 'center',
        fontSize: 12,

    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems:"center"
        // paddingVertical: 5,
        // borderRightWidth:1
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        color: '#2B4C2F',
        paddingVertical:5,

    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      },

});