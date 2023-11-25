import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStorageService } from '../../../shared/data-storage.service';
import { MapValue, DateFields } from '../../../shared/models/patient.model';
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
  patientResultsPerDate: DateFields | null = null;
  initOpts = {
    renderer: 'svg',
    width: 360,
    height: 300,
  };
  options: EChartsOption = {};

  constructor(private dataStorageService: DataStorageService) {}

  ngOnInit(): void {
    // Get and prepare the test results of the patient
    this.patientResultsPerDate =
      this.dataStorageService.getPatientResultData() || null;
    const mapOfResults: MapOfDateAndResults = this.sumResultsPerTest(
      this.patientResultsPerDate
    );
    console.log(mapOfResults);
    // Graph
    const xAxisData = [];
    const data1 = [];
    // const data2 = [];

    // Sort the days of the report
    const mapOfResultsSorted = this.sortObjectByDate(mapOfResults);
    for (const key in mapOfResultsSorted) {
      xAxisData.push(key.replace('_', '').replaceAll('_', '/'));
      data1.push(mapOfResults[key]);
    }
    this.options = {
      legend: {
        data: ['Resultado'],
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
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: 'Resultado',
          type: 'line',
          data: data1,
          animationDelay: (idx) => idx * 10,
        },
      ],
      animationEasing: 'elasticInOut',
      animationDelayUpdate: (idx) => idx * 5,
    };
  }

  sumResultsPerTest(results: DateFields | null) {
    let sums: MapOfDateAndResults = {};
    for (const key in results) {
      if (
        results[key].hasOwnProperty('arrayValue') &&
        Array.isArray(results[key].arrayValue.values)
      ) {
        sums[key] = results[key].arrayValue.values.reduce((sum, item) => {
          return (
            sum +
            (item.hasOwnProperty('integerValue')
              ? parseInt(item.integerValue, 10)
              : 0)
          );
        }, 0);
      }
    }
    return sums;
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
