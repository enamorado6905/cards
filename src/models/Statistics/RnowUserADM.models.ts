import { model, Document } from 'mongoose';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const schema = new Schema({
    year: {
        type: Number,
        required: true,
    },
    months: [{
        month: {
            type: String,
            enum: ['Ene', 'Feb', 'Marz', 'Abr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        days: [{
            day: {
                type: Number,
                required: true,
            },
            dayW: {
                type: String,
                required: true,
            },
            TotalDayUser: {
                type: Number,
                required: true,
            },
            TotalDeleteDayUser: {
                type: Number,
                required: true,
            },
        }],
        TotalMonthUser: {
            type: Number,
            required: true,
        },
        TotalDeleteMonthUser: {
            type: Number,
            required: true,
        },
    }],
    TotalYearUser: {
        type: Number,
        required: true,
    },
    TotalDeleteYearUser: {
        type: Number,
        required: true,
    },
},
    {
        timestamps: true,
    }
);

export interface ITableUserADM extends Document {
    year: Number,
    months: [{ month: string, days: [{ day: number, dayW: string, TotalDayUser: number, TotalDeleteDayUser: number }], TotalMonthUser: number, TotalDeleteMonthUser: number }],
    TotalYearUser: number, TotalDeleteYearUser: number
}

export default model<ITableUserADM>('TableUserADM', schema);
