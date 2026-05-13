"use client";

import React from 'react';
import { Hero } from '../sections/Hero';
import { DeveloperLogos } from '../sections/DeveloperLogos';
import { Process } from '../sections/Process';
import { FeasibilityEngine } from '../sections/FeasibilityEngine';
import { ArchitectReview } from '../sections/ArchitectReview';
import { Benefits } from '../sections/Benefits';
import { Difference } from '../sections/Difference';
import { CaseStudies } from '../sections/CaseStudies';
import { DataSources } from '../sections/DataSources';
import { Testimonials } from '../sections/Testimonials';
import { FAQ } from '../sections/FAQ';

export const HomePage: React.FC = () => (
  <>
    <Hero />
    <DeveloperLogos />
    <Process />
    <DataSources />
    <FeasibilityEngine />
    <ArchitectReview />
    <Benefits />
    <Difference />
    <CaseStudies />
    <Testimonials />
    <FAQ />
  </>
);
