import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStorageService } from '../../../shared/data-storage.service';
import { DateFields } from '../../../shared/models/patient.model';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

type MapOfDateAndResults = {
  [key: string]: number;
};

@Component({
  selector: 'app-patient-results',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './patient-results.component.html',
  styleUrl: './patient-results.component.css',
  providers: [provideEcharts()],
})
export class PatientResultsComponent implements OnInit {
  patientNameAndResultsPerDate: { name: string; data?: DateFields } = {
    name: '',
    data: undefined,
  }; // DateFields | null = null;
  options: EChartsOption = {};
  resultsArray: { date: string; value: number }[] = [];
  totResultsTable: {
    date: string;
    totValue: number;
    totPsychic: number;
    totSomatic: number;
  }[] = [];

  constructor(private dataStorageService: DataStorageService) {}

  ngOnInit(): void {
    // Get and prepare the test results of the patient
    this.patientNameAndResultsPerDate =
      this.dataStorageService.getPatientResultData() || null;
    const { sumPsychic, sumSomatic, totSum } = this.sumResultsPerTest(
      this.patientNameAndResultsPerDate.data
    );

    // Graph Data
    const xAxisData = [];
    const totDataPerDay = [];
    const sumPsychicPerDay = [];
    const sumSomaticPerDay = [];

    // Sort the days of the report
    const mapOfResultsSorted = this.sortObjectByDate(totSum);
    for (const key in mapOfResultsSorted) {
      xAxisData.push(key.replace('_', '').replaceAll('_', '/'));
      totDataPerDay.push(totSum[key]);
    }
    const mapOfPsychicResultsSorted = this.sortObjectByDate(sumPsychic);
    for (const key in mapOfPsychicResultsSorted) {
      sumPsychicPerDay.push(sumPsychic[key]);
    }
    const mapOfSomaticResultsSorted = this.sortObjectByDate(sumSomatic);
    for (const key in mapOfSomaticResultsSorted) {
      sumSomaticPerDay.push(sumSomatic[key]);
    }

    this.options = {
      legend: {
        data: ['Totais', 'Psíquica', 'Somática'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '10%'],
        splitLine: {
          show: true,
        },
      },
      series: [
        {
          name: 'Totais',
          type: 'line',
          data: totDataPerDay,
          animationDelay: (idx) => idx * 30,
        },
        {
          name: 'Psíquica',
          type: 'line',
          data: sumPsychicPerDay,
          animationDelay: (idx) => idx * 15,
        },
        {
          name: 'Somática',
          type: 'line',
          data: sumSomaticPerDay,
          animationDelay: (idx) => idx * 45,
        },
      ],
      animationEasing: 'elasticInOut',
      animationDelayUpdate: (idx) => idx * 5,
    };

    // Results Table
    this.resultsArray = Object.entries(mapOfResultsSorted).map(
      ([date, value]) => ({ date, value })
    );

    for (const [idx, item] of this.resultsArray.entries()) {
      this.totResultsTable.push({
        date: item.date,
        totValue: item.value,
        totPsychic: sumPsychicPerDay[idx],
        totSomatic: sumSomaticPerDay[idx],
      });
    }
  }

  sumResultsPerTest(results: DateFields | undefined) {
    let sumPsychic: MapOfDateAndResults = {};
    let sumSomatic: MapOfDateAndResults = {};
    let totSum: MapOfDateAndResults = {};
    for (const key in results) {
      if (
        results[key].hasOwnProperty('arrayValue') &&
        Array.isArray(results[key].arrayValue.values)
      ) {
        sumPsychic[key] = results[key].arrayValue.values
          .slice(0, 6)
          .reduce((sum, item) => {
            return (
              sum +
              (item.hasOwnProperty('integerValue')
                ? parseInt(item.integerValue, 10)
                : 0)
            );
          }, 0);
        sumSomatic[key] = results[key].arrayValue.values
          .slice(-6)
          .reduce((sum, item) => {
            return (
              sum +
              (item.hasOwnProperty('integerValue')
                ? parseInt(item.integerValue, 10)
                : 0)
            );
          }, 0);
        totSum[key] = results[key].arrayValue.values.reduce((sum, item) => {
          return (
            sum +
            (item.hasOwnProperty('integerValue')
              ? parseInt(item.integerValue, 10)
              : 0)
          );
        }, 0);
      }
    }
    return { sumPsychic, sumSomatic, totSum };
  }

  sortObjectByDate(obj: { [key: string]: number }): { [key: string]: number } {
    const sortedKeys = Object.keys(obj).sort((a, b) => {
      // Extract the date parts
      const aDateParts = a.substring(1).split('_').reverse();
      const bDateParts = b.substring(1).split('_').reverse();

      // Create date objects
      const aDate = new Date(
        `${aDateParts[0]}-${aDateParts[1]}-${aDateParts[2]}`
      );
      const bDate = new Date(
        `${bDateParts[0]}-${bDateParts[1]}-${bDateParts[2]}`
      );

      // Compare the dates
      return aDate.getTime() - bDate.getTime();
    });

    // Create a new sorted object
    const sortedObj: { [key: string]: number } = {};
    sortedKeys.forEach((key) => {
      sortedObj[key] = obj[key];
    });

    return sortedObj;
  }
}
